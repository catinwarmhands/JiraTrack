import React from "react";
import {Progress, Tag, Tooltip} from "antd";
import moment from "moment";
import '../styles/CellRenderers.css';
import {calculatePercent, secondsToManTimeString} from "../utils";
import _ from "lodash";
import {ColumnResizedEvent} from "ag-grid-community";

export class TextAndIconRenderer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        props.api.addEventListener('columnResized', this.handleColumnResized);
    }

    handleColumnResized = (event: ColumnResizedEvent) => {
        if (event.column === this.props.column) {
            this.forceUpdate();
        }
    }

    render = () => {
        const width = this.props.column.getActualWidth();
        const img = this.props.value.iconUrl && <img src={this.props.value.iconUrl} alt={this.props.value.text}/>;
        if (width > 100) {
            return (
                <span className={"text-and-icon-renderer"}>
                    {img}
                    <span className={"vertical-align-middle"}>
                        {this.props.value.href ? <HrefRenderer value={this.props.value}/> : this.props.value.text}
                    </span>
                </span>
            );
        } else {
            return (
                <span className={"text-and-icon-renderer"}>
                    <Tooltip title={this.props.value.text}>
                        {
                            this.props.value.href ?
                                <a href={this.props.value.href || "/"} target="_blank" rel="noopener noreferrer">
                                    {img}
                                </a>
                                :
                                img
                        }
                    </Tooltip>
                </span>
            );
        }
    }
}

export class HrefRenderer extends React.Component<any, any> {
    render = () => {
        return (
            <a className={"fancy-href"} href={this.props.value.href || "/"} target="_blank" rel="noopener noreferrer">
                {this.props.value.text}
            </a>
        );
    }
}

export class TagRenderer extends React.Component<any, any> {
    render = () => {
        return <TagsRenderer value={[this.props.value]} color={"#108ee9"}/>;
    }
}

export class TagsRenderer extends React.Component<any, any> {
    render = () => {
        return (
            <span>
            {
                this.props.value.map((name: string) =>
                    <Tag
                        color={this.props.color}
                        className="tag-text"
                        key={name}
                    >
                        {name}
                    </Tag>
                )
            }
            </span>
        );
    }
}

export class ManTimeRenderer extends React.Component<any, any> {
    render = () => {
        const initialString = secondsToManTimeString(this.props.value.initial);
        const factString = secondsToManTimeString(this.props.value.fact);
        const percent = calculatePercent(this.props.value);
        const isBothValuesPresent = _.isSafeInteger(this.props.value.fact) && _.isSafeInteger(this.props.value.initial);
        const status = (isBothValuesPresent && this.props.value.fact > this.props.value.initial) ? "exception" : undefined;
        return (
            <div className={"man-time-cell"}>
                <div className={"man-time-cell--value"}>
                    {initialString} / {factString}
                </div>
                {
                    isBothValuesPresent &&
                    <div className={"man-time-cell--progress"}>
                        <Progress
                            percent={percent}
                            success={status ? undefined : {percent: percent}} // что бы даже если < 100, то все равно было зеленым
                            size="small"
                            status={status}
                            format={_ => `${percent}%`} // процент клэмпится до 100, приходится форсить
                        />
                    </div>
                }
            </div>
        );
    }
}

export const dateFormatter = (params: any): string => {
    const m = moment(params.value);
    if (!m.isValid()) {
        return params.value;
    }
    return m.format("DD.MM.yyyy");
}