import React from "react";
import {Tag, Tooltip} from "antd";
import moment from "moment";

export class NameAndIconRenderer extends React.Component<any, any> {
    render = () => {
        return (
            <span>
                {this.props.value.iconUrl && <img src={this.props.value.iconUrl} alt={this.props.value.name}/>}
                {this.props.value.name}
            </span>
        );
    }
}

export class NameAndIconCompactRenderer extends React.Component<any, any> {
    render = () => {
        return (
            <span>
                <Tooltip title={this.props.value.name}>
                    {this.props.value.iconUrl && <img src={this.props.value.iconUrl} alt={this.props.value.name}/>}
                </Tooltip>
            </span>
        );
    }
}

export class KeyRenderer extends React.Component<any, any> {
    render = () => {
        return (
            <a href={this.props.value.href || "/"} target="_blank" rel="noopener noreferrer">
                {this.props.value.code}
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

export const dateFormatter = (params: any): string => {
    const m = moment(params.value);
    if (!m.isValid()) {
        return params.value;
    }
    return m.format("DD.MM.yyyy");
}