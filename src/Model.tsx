import {Moment} from 'moment'
import {FilterValueType} from "./components/FilterInput";
import {keyComparator} from "./components/Comparators";

interface ModelProps {
    showMessage: (category: "success" | "warning" | "error", msg: string) => void;
    onProgressChange: (percent: number, failed: boolean) => void;
    onDataChange: (rowData: any[]) => void;
    fetchCount: number;
}

interface ModelState {
    jiraUrl?: string;
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
        const originUrl = new URL(values.jiraUrl).origin;

        this.setState({
            ...values,
            needsRefresh: true,
            originUrl: originUrl,
            searchUrl: originUrl + "/rest/api/2/search",
            headers: new Headers({
                "Content-Type": "application/json",
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
        return jql.join(" ");
    }

    request = async (url: string, params: any): Promise<any> => {
        return await fetch(url + "?" + new URLSearchParams(params), {
            method: 'GET',
            headers: this.state.headers!,
        }).then((response) => response.json()).catch(err => this.props.showMessage("error", err));
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
                    // "assignee",
                ]
            });
            for (const e of response.issues) {
                result.push({
                    type: {name: e.fields.issuetype?.name, iconUrl: e.fields.issuetype?.iconUrl},
                    key: {code: e.key, href: this.state.originUrl! + "/browse/" + e.key},
                    priority: {name: e.fields.priority?.name, iconUrl: e.fields.priority?.iconUrl},
                    status: e.fields.status?.name,
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
                });
            }
            this.setState({progress: Math.round(result.length / totalIssuesCount * 100)});

            if (i >= 100) {
                break;
            }
        }

        result.sort((a: any, b: any) => keyComparator(a.key, b.key));
        this.setState({progress: 100});

        return result;
    }
}