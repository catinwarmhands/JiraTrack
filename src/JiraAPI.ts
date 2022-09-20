import {keyComparator} from "./components/Comparators";

export class JiraAPI {
    username: string;
    password: string;
    project: string;
    originURL: string;
    searchURL: string;
    headers: any;
    fetchCount: number = 10;

    constructor(jiraUrl: string, username: string, password: string, project: string) {
        this.username = username;
        this.password = password;
        this.project = project;
        this.originURL = new URL(jiraUrl).origin;
        this.searchURL = this.originURL + "/rest/api/2/search";

        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Authorization", "Basic " + btoa(username + ":" + password));
        // this.headers.append("Access-Control-Allow-Origin", "*");
        // this.headers.append("cookie", "JSESSIONID=DC71CE27486B77A1EAF60129C4D5E559");
    }

    getJQL = (): string => {
        let jql: string[] = [];
        jql.push("project =");
        jql.push(this.project);
        return jql.join(" ");
    }

    request = async (url: string, params: any): Promise<any> => {
        return await fetch(url + "?" + new URLSearchParams(params), {
            method: 'GET',
            headers: this.headers,
        }).then((response) => response.json());
    }

    getTotalIssuesCount = async (jql: string) => {
        const result = await this.request(this.searchURL, {maxResults: "0", jql: jql});
        return result.total;
    }

    getIssues = async (setProgress?: (progress: number) => void) => {
        const jql = this.getJQL();
        const totalIssuesCount = await this.getTotalIssuesCount(jql);

        setProgress && setProgress(0);

        let result: any[] = [];
        for (let i = 0; i < totalIssuesCount; i += this.fetchCount) {
            const response = await this.request(this.searchURL, {
                startAt: i.toString(),
                maxResults: this.fetchCount.toString(),
                jql: jql,
                fields: [
                    "issuetype",
                    "priority",
                    "status",
                    "summary",
                    "labels",
                    "created",
                    "duedate",
                    "updated",
                    // "assignee",

                ]
            });
            for (const e of response.issues) {
                result.push({
                    type: {name: e.fields.issuetype.name, iconUrl: e.fields.issuetype.iconUrl},
                    key: {code: e.key, href: this.originURL + "/browse/" + e.key},
                    priority: {name: e.fields.priority.name, iconUrl: e.fields.priority.iconUrl},
                    status: e.fields.status.name,
                    summary: e.fields.summary,
                    tags: e.fields.labels,
                    dateCreated: e.fields.created,
                    dateRelease: e.fields.duedate,
                    dateUpdated: e.fields.updated,
                    // reopenCount: e.fields.reopenCount,
                    // reopenAnalytics: e.fields.reopenAnalytics,
                    // reopenDevelopment: e.fields.reopenDevelopment,
                    // reopenTesting: e.fields.reopenTesting,
                    // initialEstimate: e.fields.initialEstimate,
                    // factSpend: e.fields.factSpend,
                    // dateOpen: e.fields.dateOpen,
                    // dateRelease: e.fields.dateRelease,
                });
            }
            setProgress && setProgress(Math.round(result.length / totalIssuesCount * 100));
            if (i >= 100) {
                break;
            }
        }

        setProgress && setProgress(100);

        result.sort((a: any, b: any) => keyComparator(a.key, b.key));
        return result;
    }
}