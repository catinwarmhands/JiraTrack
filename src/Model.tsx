import {Moment} from 'moment'
import {FilterValueType} from "./components/FilterInput";
import {getValueWithHighestIntegerKey, jqlEqualsOrIn, jqlEscapeString} from "./utils";

const JIRA_URL = "https://neojira.neoflex.ru/";

export type TextAndIconType = {text: string, iconUrl: string, href?: string};
export type HrefType = {text: string, href: string};
export type ManTimeType = {initial: number, fact: number};

interface ModelProps {
    showMessage: (category: "success" | "warning" | "error", msg: string) => void;
    onProgressChange: (percent: number, failed: boolean) => void;
    onDataChange: (rowData: any[]) => void;
    fetchCount: number;
}

interface ModelState {
    username?: string;
    password?: string;
    project?: string;
    issues?: string[];
    dateOpen?: (Moment | undefined)[];
    dateRelease?: (Moment | undefined)[];
    dateLastChange?: (Moment | undefined)[];
    status?: string[];
    tags?: string[];
    tagsMode?: string;
    assignee?: string;
    assigneeMode?: string;
    reopenFilters?: FilterValueType[];
    returnFilters?: FilterValueType[];

    rowData: any[];

    progress: number;
    updateFailed: boolean;

    originUrl?: string;
    userUrl?: string;
    searchUrl?: string;
    headers?: Headers;
}

export default class Model {
    props: ModelProps;
    state: ModelState;

    constructor(props: ModelProps) {
        this.props = props;
        this.state = {
            progress: 0,
            updateFailed: false,
            rowData: [],
        }
        this.componentDidUpdate(this.state);
    }

    setState = (values: {[key: string]: any}) => {
        const prevState = {...this.state};
        for (const key in values) {
            const value = values[key];
            this.state[key as keyof ModelState] = value as never;
        }
        this.componentDidUpdate(prevState);
    }

    componentDidUpdate = (prevState: Readonly<ModelState>) => {
        if (this.state.progress !== prevState.progress || this.state.updateFailed !== prevState.updateFailed) {
            this.props.onProgressChange(this.state.progress, this.state.updateFailed);
        }
    }

    isUpdateFailed = (): boolean => {
        return this.state.updateFailed;
    }

    handleSubmit = (values: {[key: string]: any}) => {
        const originUrl = new URL(JIRA_URL).origin;

        this.setState({
            ...values,
            needsRefresh: true,
            originUrl: originUrl,
            userUrl: originUrl + "/secure/ViewProfile.jspa?name=",
            searchUrl: originUrl + "/rest/api/2/search",
            headers: new Headers({
                // "Content-Type": "application/json",
                "Authorization": "Basic " + btoa(values.username + ":" + values.password),
            })
        });

        this.update();
    }

    update = async () => {
        try {
            this.setState({updateFailed: false, progress: 0});
            let rowData = await this.getIssues();
            console.log(rowData)
            this.setState({rowData: rowData})
        } catch (e: any) {
            console.error(e);
            this.props.showMessage("error", e.message);
            this.setState({updateFailed: true, rowData: []});
        } finally {
            this.props.onDataChange(this.state.rowData);
        }
    }

    getJQL = (): string => {
        let jql: string[] = [];
        jql.push("project =");
        jql.push(this.state.project!);

        if (this.state.issues && this.state.issues.length >= 1) {
            jql.push("AND");
            jql.push("issuekey");
            jql.push(jqlEqualsOrIn(this.state.issues.map(issue => this.state.project! + "-" + issue)));
        }

        if (this.state.assignee) {
            jql.push("AND");
            if (this.state.assigneeMode === "is") {
                jql.push("assignee = " + this.state.assignee);
            } else if (this.state.assigneeMode === "was") {
                jql.push("(assignee WAS " + this.state.assignee + " AND assignee != " + this.state.assignee + ")");
            } else { // any
                jql.push("assignee WAS " + this.state.assignee);
            }
        }

        if (this.state.tags && this.state.tags.length >= 1) {
            const escapedTags = this.state.tags.map(jqlEscapeString);
            jql.push("AND");
            if (this.state.tagsMode === "any") {
                jql.push("labels");
                jql.push(jqlEqualsOrIn(escapedTags));
            } else { // all
                jql.push("(");
                jql.push(escapedTags.map(tag => "labels = " + tag).join(" AND "));
                jql.push(")");
            }
        }

        jql.push("ORDER BY key ASC");
        console.log("jql", jql.join(" "))
        return jql.join(" ");
    }

    request = async (url: string, params?: any): Promise<any> => {
        if (params) {
            url = url + "?" + new URLSearchParams(params);
        }
        return await fetch(url, {
            method: 'GET',
            headers: this.state.headers!,
        })
        .then((response) => response.json())
        .catch(err => this.props.showMessage("error", err));
    }

    getTotalIssuesCount = async (jql: string) => {
        const result = await this.request(this.state.searchUrl!, {maxResults: "0", jql: jql});
        if (result.errorMessages && result.errorMessages.length >= 1) {
            throw Error(result.errorMessages[0]);
        }
        return result.total;
    }

    getIssues = async () => {
        const jql = this.getJQL();
        const totalIssuesCount = await this.getTotalIssuesCount(jql);

        let result: any[] = [];
        let usersAvatars: {[key: string]: any} = {};
        for (let i = 0; i < totalIssuesCount; i += this.props.fetchCount) {
            const response = await this.request(this.state.searchUrl!, {
                startAt: i.toString(),
                maxResults: this.props.fetchCount.toString(),
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
                    "assignee",
                    "timeoriginalestimate",
                    "aggregatetimespent",
                    "timespent"
                ],
                expand: [
                    "changelog"
                ]
            });
            console.log(response);

            for (const e of response.issues) {
                // аватарки
                if (!(e.fields.assignee?.name in usersAvatars)) {
                    const avatarUrl = getValueWithHighestIntegerKey(e.fields.assignee?.avatarUrls);
                    usersAvatars[e.fields.assignee?.name] = await fetch(avatarUrl, {
                        method: 'GET',
                        headers: this.state.headers!,
                    }).then(response => response.blob()).then(URL.createObjectURL);
                }

                result.push({
                    type: {text: e.fields.issuetype?.name, iconUrl: e.fields.issuetype?.iconUrl},
                    key: {text: e.key, href: this.state.originUrl! + "/browse/" + e.key},
                    priority: {text: e.fields.priority?.name, iconUrl: e.fields.priority?.iconUrl},
                    status: e.fields.status?.name,
                    summary: e.fields.summary,
                    assignee: {
                        text: e.fields.assignee?.displayName,
                        iconUrl: usersAvatars[e.fields.assignee?.name],
                        href: this.state.userUrl + e.fields.assignee?.name
                    },
                    tags: e.fields.labels,
                    dateCreated: e.fields.created,
                    dateRelease: e.fields.duedate,
                    dateUpdated: e.fields.updated,
                    // reopenCount: e.fields.reopenCount,
                    // returnAnalytics: e.fields.reopenAnalytics,
                    // returnDevelopment: e.fields.reopenDevelopment,
                    // returnTesting: e.fields.reopenTesting,
                    manTime: {initial: e.fields.timeoriginalestimate, fact: e.fields.aggregatetimespent || e.fields.timespent}
                });

                this.setState({progress: Math.round(result.length / totalIssuesCount * 100)});
            }

            // if (result.length >= 10) {
            //     break;
            // }
        }

        // result.sort((a: any, b: any) => keyComparator(a.key, b.key));
        this.setState({progress: 100});

        return result;
    }
}