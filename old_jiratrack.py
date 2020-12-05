#deprecated file2
import sys
import json
import requests
import datetime
import getpass
from tqdm import tqdm
from termcolor import colored, cprint
from collections import defaultdict 
import xlsxwriter
import string
from concurrent.futures import ProcessPoolExecutor, as_completed


class Jira:
    def __init__(self, host, username, password, target_project, target_username):
        self.target_project  = target_project
        self.target_username = target_username
        self._username  = username
        self._password  = password
        self._auth_data = requests.auth.HTTPBasicAuth(username, password)
        self._host = host
        if self._host[-1] != '/':
            self._host += '/'
        self._issue = f"{self._host}rest/api/2/issue/"
        self._list_of_issues = f"{self._host}rest/api/2/search"

    def _url_issue_info(self, issue_name):
        return self._issue + issue_name

    def _url_issue_comments(self, issue_name):
        return self._issue + issue_name + '/comment'

    def _url_list_of_issues(self):
        return self._list_of_issues

    def _jql_list_of_issues(self, target_project, target_username):
        return f"project = {target_project} AND assignee was {target_username}" # AND createdDate > \"2020/04/15\""

    def _get_json(self, url, params=None):
        if params is None:
            params = {}
        response = requests.get(url, params, auth=self._auth_data)
        result = response.json()
        return result

    def get_total_number_of_issues(self, target_project=None, target_username=None):
        if target_project is None:
            target_project = self.target_project
        if target_username is None:
            target_username = self.target_username

        data = self._get_json(
            url=self._url_list_of_issues(),
            params={
                "maxResults": 0,
                "jql": self._jql_list_of_issues(target_project, target_username)
            }
        )
        return data["total"]

    def get_list_of_issues(self, target_project=None, target_username=None, n=None):
        if target_project is None:
            target_project = self.target_project
        if target_username is None:
            target_username = self.target_username
        if n is None:
            n = self.get_total_number_of_issues(target_project, target_username)

        data = self._get_json(
            url=self._url_list_of_issues(),
            params={
                "maxResults": n,
                "jql": self._jql_list_of_issues(target_project, target_username)
            }
        )
        issues = [issue["key"] for issue in data["issues"]]
        return issues


    def get_issue_info(self, issue_name):
        data_main = self._get_json(
            url=self._url_issue_info(issue_name),
            params={"expand": "changelog"}
        )

        data_comments = self._get_json(
            url=self._url_issue_comments(issue_name)
        )

        data_main["comments"] = data_comments["comments"]

        return data_main

    def get_issue_history(self, issue_name):
        issue = self.get_issue_info(issue_name)
        history = []
        for entry in issue["changelog"]["histories"]:
            for item in entry["items"]:
                try:
                    history.append({
                        "time":   entry["created"],
                        "author": entry["author"]["name"],
                        "field":  item["field"].lower(),
                        "value":  (item["toString"] or "").lower()#.replace('\r', '').replace('\n', '').lower()
                    })
                except:
                    print(colored("BAD ITEM", "red"), item)
                    exit()


        for entry in issue["comments"]:
            history.append({
                "time":   entry["created"],
                "author": entry["author"]["name"],
                "field":  "comment",
                "value":  entry["body"]#.lower()#.replace('\r', '').replace('\n', '').lower()
            })
        
        history = sorted(history, key=lambda e: e["time"])
        return history

    def analyze(self, issue_name, issue_history):
        result = dict()

        result["url"]    = f"{self._host}browse/{issue_name}"
        result["time"]   = None
        result["open"]   = False
        result["return"] = False
        result["reopen"] = False
        result["custom_fields"] = ""

        has_returned_from_testing = False
        has_returned_from_prod    = False
        state_target_user_got_issue  = False
        state_target_user_done_issue = False
        state_issue_is_closed = False
        custom_fields = dict()

        for entry in issue_history:
            if entry["author"] == self.target_username:
                if entry["field"] == "comment":
                    for line in entry["value"].splitlines():
                        space_pos = line.find(' ')
                        if len(line) > 2 and line[0] == '/' and space_pos != -1:
                            value = line[space_pos+1:]
                            if len(value) != 0:
                                custom_fields[line[1:space_pos]] = value
                                if result["time"] is None:
                                    result["time"] = simplfy_time(entry["time"])

                if entry["field"] == "status" and ("in progress" in entry["value"] or "разработка" in entry["value"]):
                    result["time"] = simplfy_time(entry["time"])
                    if state_target_user_got_issue:
                        if state_target_user_done_issue:
                            has_returned_from_testing = True
                        if state_issue_is_closed:
                            has_returned_from_prod = True
                    else:
                        state_target_user_got_issue = True

                if entry["field"] == "status" and "test backlog" in entry["value"]:
                    state_target_user_got_issue  = True
                    state_target_user_done_issue = True
                    
            if state_target_user_got_issue and entry["field"] == "status" and"closed" in entry["value"] or "resolved" in entry["value"]:
                state_issue_is_closed = True

        if not state_issue_is_closed:
            result["open"] = True
        if has_returned_from_testing:
            result["return"] = True
        if has_returned_from_prod:
            result["reopen"] = True
        
        for v, k in group_dict(custom_fields).items():
            if result["custom_fields"]:
                result["custom_fields"] += ", "
            result["custom_fields"] += f"{pretty_list(k)} {v}"

        return result
  
def simplfy_time(t):
    # например t = '2020-07-21T16:33:37.000+0300'
    return datetime.datetime.strptime(t, '%Y-%m-%dT%H:%M:%S.000+0300').strftime('%Y-%m-%d %H:%M:%S')


def group_dict(d):
    v = defaultdict(list)
    for key, value in sorted(d.items()):
        v[value].append(key)
    return dict(v)


def pretty_list(l):
    if len(l) == 0:
        return ""
    if len(l) == 1:
        return str(l[0])

    return ", ".join(l[:len(l)-1]) + " и " + l[len(l)-1]


def pretty_print_result(result):
    print(result["url"], end=' ')
    if result["open"]:
        print(colored("Ещё не закрыто", "cyan"), end=' ')
    if result["return"]:
        print(colored("Возврат из тестирования", "yellow"), end=' ')
    if result["reopen"]:
        print(colored("Реопен", "red"), end=' ')
    print(colored(result["custom_fields"], "magenta"), end=' ')
    print()


def output_to_xlsx(results, filename=None):
    if filename == None:
        filename = f"Jira {datetime.datetime.now().strftime('%d.%m.%Y')}"
    if not filename.endswith(".xlsx"):
        filename += ".xlsx"
    
    workbook = xlsxwriter.Workbook(filename)
    worksheet = workbook.add_worksheet()

    header      = ["URL", "Time", "Open", "Return", "Reopen", "Notes"]
    row_indexes = ["url", "time", "open", "return", "reopen", "custom_fields"]
    widths = list(map(len, header))


    for j, item in enumerate(header):
        worksheet.write(0, j, item)

    for i, result in enumerate(results, 1):
        for j, index in enumerate(row_indexes):
            value = result[index]
            if isinstance(value, bool):
                value = 1 if value else ''
            l = len(str(value)) 
            if l > widths[j]:
                widths[j] = l
            worksheet.write(i, j, value)

    for j, width in enumerate(widths):
        worksheet.set_column(j, j, width+1)

    blue_format   = workbook.add_format({'bg_color': '#279289', 'font_color': '#279289'})
    yellow_format = workbook.add_format({'bg_color': '#FAE39C', 'font_color': '#FAE39C'})
    red_format    = workbook.add_format({'bg_color': '#B12000', 'font_color': '#B12000'})
    total_rows    = len(results)+1
    letter_Open   = string.ascii_uppercase[header.index("Open")]
    letter_Return = string.ascii_uppercase[header.index("Return")]
    letter_Reopen = string.ascii_uppercase[header.index("Reopen")]
    format_conditions = {"type": "cell", "criteria": "=", "value": 1}
    worksheet.conditional_format(f"{letter_Open}1:{letter_Open}{total_rows}",     {**format_conditions, "format": blue_format})
    worksheet.conditional_format(f"{letter_Return}1:{letter_Return}{total_rows}", {**format_conditions, "format": yellow_format})
    worksheet.conditional_format(f"{letter_Reopen}1:{letter_Reopen}{total_rows}", {**format_conditions, "format": red_format})

    workbook.close()

    return filename


def parallel_process(array, function, n_jobs=4, use_kwargs=False, front_num=0):
    """
        A parallel version of the map function with a progress bar. 

        Args:
            array (array-like): An array to iterate over.
            function (function): A python function to apply to the elements of array
            n_jobs (int, default=4): The number of cores to use
            use_kwargs (boolean, default=False): Whether to consider the elements of array as dictionaries of 
                keyword arguments to function 
            front_num (int, default=0): The number of iterations to run serially before kicking off the parallel job. 
                Useful for catching bugs
        Returns:
            [function(array[0]), function(array[1]), ...]
    """
    #We run the first few iterations serially to catch bugs
    front = []
    if front_num > 0:
        front = [function(**a) if use_kwargs else function(a) for a in array[:front_num]]
    #If we set n_jobs to 1, just run a list comprehension. This is useful for benchmarking and debugging.
    if n_jobs==1:
        return front + [function(**a) if use_kwargs else function(a) for a in tqdm(array[front_num:])]
    #Assemble the workers
    with ProcessPoolExecutor(max_workers=n_jobs) as pool:
        #Pass the elements of array into function
        if use_kwargs:
            futures = [pool.submit(function, **a) for a in array[front_num:]]
        else:
            futures = [pool.submit(function, a) for a in array[front_num:]]
        kwargs = {
            'total': len(futures),
            'unit': 'it',
            'unit_scale': True,
            'leave': True
        }
        #Print out the progress as tasks complete
        for f in tqdm(as_completed(futures), **kwargs):
            pass
    out = []
    #Get the results from the futures. 
    for i, future in tqdm(enumerate(futures)):
        try:
            out.append(future.result())
        except Exception as e:
            out.append(e)
    return front + out


def main():
    if len(sys.argv) < 3:
        print(f"Usage: python {__file__} your_username target_project [target_username]")
        exit()

    password = getpass.getpass("Пароль от Jira: ")

    jira = Jira(
        host            = "https://jira-new.neoflex.ru",
        username        = sys.argv[1],
        password        = password,
        target_project  = sys.argv[2],
        target_username = sys.argv[3] if len(sys.argv) >= 4 else sys.argv[1]
    )

    # issues = [
        # "NFBDSSOHA-1001",
        # "NFBDSSOHA-993",
        # "NFBDSSOHA-988",
        # "NFBDSSOHA-942",
    # ]
    # print(json.dumps(jira.get_issue_history(issues[0])))
    # exit()

    print("Получаем логи...")
    issues = jira.get_list_of_issues()
    histories = parallel_process(
        array=issues,
        function=jira.get_issue_history,
        n_jobs=6
    )
    results = []
    for issue_name, issue_history in zip(issues, histories):
        results.append(jira.analyze(issue_name, issue_history))
        
    for result in results:
        pretty_print_result(result)
        
    print("--------------------------------------------------")
    
    count_total = len(issues)
    count_returned_from_testing = len(list(filter(None, map(lambda r: r["return"], results))))
    count_returned_from_prod    = len(list(filter(None, map(lambda r: r["reopen"], results))))

    print(f"Всего {count_total} задач")
    print(f"Возвратов из тестирования {count_returned_from_testing} шт ({count_returned_from_testing/count_total*100:.2f}%)")
    print(f"Реопенов {count_returned_from_prod} шт ({count_returned_from_prod/count_total*100:.2f}%)")

    xlsx_filename = output_to_xlsx(results)
    print()
    print(f"Результат записан в \"{xlsx_filename}\"")

if __name__== "__main__":
    main()
