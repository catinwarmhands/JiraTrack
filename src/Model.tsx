import * as React from "react";
import {Moment} from 'moment'
import {FilterValueType} from "./components/FilterInput";
import _ from "lodash";

interface ModelProps {
}
interface ModelState {
    jiraUrl?: string;
    username?: string;
    password?: string;
    project?: string;
    issues?: string[];
    dateOpen?: (Moment | undefined)[];
    dateRelease?: (Moment | undefined)[];
    status?: string[];
    tags?: string[];
    tagsMode?: string;
    assignee?: string;
    assigneeMode?: string;
    reopenFilters?: FilterValueType[];
    returnFilters?: FilterValueType[];

    needsUpdate: boolean;
}

export class Model extends React.Component<ModelProps, ModelState> {

    constructor(props: ModelProps) {
        super(props);
        this.state = {
            needsUpdate: false,
        }
        console.log("construtor");
    }

    componentDidUpdate = (prevProps: Readonly<ModelProps>, prevState: Readonly<ModelState>) => {
        if (!_.isEqual(this.state, prevState)) {
            console.log("componentDidUpdate", this.state);
        }
    }

    updateFields = (values: {[key: string]: any}) => {
        console.log("updateFields", values);
        // this.setState({
        //     jiraUrl: values.jiraUrl,
        //     username: values.username,
        //     password: values.password,
        //     project: values.project,
        //     issues: values.issues,
        //     dateOpen: values.dateOpen,
        //     dateRelease: values.dateRelease,
        //     status: values.status,
        //     tags: values.tags,
        //     tagsMode: values.tagsMode,
        //     assignee: values.assignee,
        //     assigneeMode: values.assigneeMode,
        //     reopenFilters: values.reopenFilters,
        //     returnFilters: values.returnFilters,
        // });
    }
}