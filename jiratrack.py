import sys
import json
import requests
import datetime
import getpass
from tqdm import tqdm as progressbar
from termcolor import colored, cprint
from collections import defaultdict 

class Jira:
    def __init__(self, host, username, password, target_project, target_username):
        self.target_project  = target_project
        self.target_username = target_username
        self._username  = username
        self._password  = password
        self._auth_data = requests.auth.HTTPBasicAuth(username, password)
        if host[-1] != '/':
            host += '/'
        self._issue = f"{host}rest/api/2/issue/"
        self._list_of_issues = f"{host}rest/api/2/search"

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

        # можно выгружать ещё и комментарии, но пока смысла нет

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

def pretty_format(delta):
    total_secs = delta.seconds
    secs = total_secs % 60
    total_mins = total_secs / 60
    mins = total_mins % 60
    hours = total_mins / 60 + delta.days*24
    if int(str(int(hours))[-1]) == 1:
        h = 'час'
    elif int(str(int(hours))[-1]) in (2,3,4):
        h = 'часа'
    else:
        h = 'часов'
    if int(hours) != hours:
        if hours < 1:
            return f"{int(mins)} минут"
        else:
            return f"{int(hours)} {h} {int(mins)} минут"
    else:
        return f"{int(hours)} {h}"


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
    #     "NFBDSSOHA-816",
    # ]
    # print(json.dumps(jira.get_issue_history(issues[0])))
    # exit()

    print("Получаем логи...")
    issues = jira.get_list_of_issues()
    histories = []
    for issue in progressbar(issues):
        histories.append(jira.get_issue_history(issue))

    count_total = len(issues)
    count_returned_from_testing = 0
    count_returned_from_prod = 0

    for issue, history in zip(issues, histories):
        print(f"https://jira-new.neoflex.ru/browse/{issue}", end=' ')

        has_returned_from_testing = False
        has_returned_from_prod    = False
        state_target_user_got_issue  = False
        state_target_user_done_issue = False
        state_issue_is_closed = False
        custom_fields = dict()

        for entry in history:
            if entry["author"] == jira.target_username:
                if entry["field"] == "comment":
                    for line in entry["value"].splitlines():
                        space_pos = line.find(' ')
                        if len(line) > 2 and line[0] == '/' and space_pos != -1:
                            value = line[space_pos+1:]
                            if len(value) != 0:
                                custom_fields[line[1:space_pos]] = value

                if entry["field"] == "status" and ("in progress" in entry["value"] or "разработка" in entry["value"]):
                    if state_target_user_got_issue:
                        if state_target_user_done_issue:
                            has_returned_from_testing = True
                        if state_issue_is_closed:
                            has_returned_from_prod = True
                    else:
                        state_target_user_got_issue = True

                if entry["field"] == "timeoriginalestimate":
                    time_estimate = int(entry["value"])
                if entry["field"] == "timeestimate":
                    time_real     = int(entry["value"])

                if entry["field"] == "status" and "test backlog" in entry["value"]:
                    state_target_user_got_issue  = True
                    state_target_user_done_issue = True
                    
            if state_target_user_got_issue and entry["field"] == "status" and"closed" in entry["value"] or "resolved" in entry["value"]:
                state_issue_is_closed = True


        if not state_issue_is_closed:
            print(colored("Ещё не закрыто", "cyan"), end=' ')
        if has_returned_from_testing:
            count_returned_from_testing += 1
            print(colored("Возврат из тестирования", "yellow"), end=' ')
        if has_returned_from_prod:
            count_returned_from_prod += 1
            print(colored("Реопен", "red"), end=' ')
        
        # сгруппируем поля что бы было красивее
        for v, k in group_dict(custom_fields).items():
            print(colored(f"{pretty_list(k)} {v}", "magenta"), end=' ')

        print()
    
    print("--------------------------------------------------")
    
    print(f"Всего {count_total} задач")
    print(f"Возвратов из тестирования {count_returned_from_testing} шт ({count_returned_from_testing/count_total*100:.2f}%)")
    print(f"Реопенов {count_returned_from_prod} шт ({count_returned_from_prod/count_total*100:.2f}%)")


if __name__== "__main__":
    main()
