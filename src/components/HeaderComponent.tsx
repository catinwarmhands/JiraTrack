import React, { Component } from 'react';
import {EyeInvisibleOutlined} from '@ant-design/icons';
import "../styles/HeaderComponent.css"

export default class HeaderComponent extends Component<any, any> {
    render = () => {
        return (
            <div className="customHeader">
                <div className="customHeaderLabel">
                    {this.props.displayName}
                </div>
                <div className={"customHeaderButton"}>
                    <span
                        role={"button"}
                        tabIndex={-1}
                        onClick={this.handleHide}
                    >
                        <EyeInvisibleOutlined/>
                    </span>
                </div>
            </div>
        );
    }

    handleHide = () => {
        this.props.columnApi.setColumnVisible(this.props.column.colId, false);
    }
}