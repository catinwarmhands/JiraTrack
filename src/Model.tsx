import * as React from "react";
import {Moment} from 'moment'
import {FilterValueType} from "./components/FilterInput";
import _ from "lodash";
import {JiraAPI} from "./JiraAPI";

interface ModelProps {
    showMessage: (category: "success" | "warning" | "error", msg: string) => void;
    onProgressChange: (percent: number, failed: boolean) => void;
    onDataChange: (rowData: any[]) => void;
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

    needsFullUpdate: boolean;
    needsPartialUpdate: boolean;
    needsRefresh: boolean;
    progress: number;
    api?: JiraAPI;
    updateFailed: boolean;
}

export default class Model {
    props: ModelProps;
    state: ModelState;

    constructor(props: ModelProps) {
        this.props = props;
        this.state = {
            needsFullUpdate: false,
            needsPartialUpdate: false,
            needsRefresh: false,
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
        if (
            this.state.jiraUrl !== prevState.jiraUrl
            || this.state.username !== prevState.username
            || this.state.password !== prevState.password
            || this.state.project !== prevState.project
        ) {
            this.setState({needsFullUpdate: true, needsRefresh: false});
        }

        if (this.state.progress !== prevState.progress || this.state.updateFailed !== prevState.updateFailed) {
            this.props.onProgressChange(this.state.progress, this.state.updateFailed);
        }

        if (!_.isEqual(this.state.rowData, prevState.rowData)) {
            this.props.onDataChange && this.props.onDataChange(this.state.rowData);
        }
    }

    setProgress = (progress: number) => {
        this.setState({progress: progress});
    }

    onStart = (values: {[key: string]: any}) => {
        this.setState(values);
        this.setState({needsRefresh: true});
        this.setState({helloWorld: true});
        this.update();
    }

    update = async () => {
        try {
            if (this.state.needsFullUpdate) {
                await this.fullUpdate();
                this.props.showMessage("success", "done fullUpdate");
            } else if (this.state.needsPartialUpdate) {
                await this.partialUpdate();
                this.props.showMessage("success", "done partialUpdate");
            }
            if (this.state.needsRefresh) {
                await this.refresh()
                this.props.showMessage("success", "done refresh");
            }
            this.setState({
                needsFullUpdate: false,
                needsPartialUpdate: false,
                needsRefresh: false,
                updateFailed: false,
            });
        } catch (e: any) {
            this.props.showMessage("error", e.message);
            this.setState({updateFailed: true});
        }
    }

    fullUpdate = async () => {
        const api = new JiraAPI(this.state.jiraUrl!, this.state.username!, this.state.password!, this.state.project!);
        let rowData = await api.getIssues(this.setProgress);
        console.log(rowData)
        this.setState({rowData: rowData})
        this.setState({needsRefresh: false});
    }

    partialUpdate = async () => {

    }

    refresh = async () => {

    }
}