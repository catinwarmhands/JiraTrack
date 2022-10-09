import React, { Component } from 'react';
import {EyeInvisibleOutlined} from '@ant-design/icons';
import "../styles/HeaderComponent.css"
import {ColDef} from "ag-grid-community/dist/lib/entities/colDef";

export default class HeaderComponent extends Component<any, any> {
    constructor(props: any) {
        super(props);
        props.api.addEventListener('sortChanged', this.onSortChanged);
    }

    componentDidMount = () => {
        this.onSortChanged();
    }

    handleHideClick = () => {
        this.props.columnApi.setColumnVisible(this.props.column.colId, false);
    }

    handleSortClick = (event: any) => {
        this.props.progressSort(event.ctrlKey);
    }

    onSortChanged = () => {
        this.forceUpdate();
    }

    render = () => {
        const sortedColumns = this.props.columnApi.getColumnState().filter((cd: ColDef) => cd.sort);
        const sortIndex = (sortedColumns.length > 1 && this.props.column.getSort()) ? (this.props.column.getSortIndex() + 1) : undefined;

        return (
            <div className="custom-header">
                <span className="custom-header-label" onClick={this.handleSortClick}>
                    {this.props.displayName}
                </span>
                {this.props.column.isSortAscending() && <span className="custom-header-sort-arrow ag-icon ag-icon-asc" unselectable="on" role="presentation"/>}
                {this.props.column.isSortDescending() && <span className="custom-header-sort-arrow ag-icon ag-icon-desc" unselectable="on" role="presentation"/>}
                {sortIndex && <span className="custom-header-sort-index">{sortIndex}</span>}
                <div className={"custom-header-button"}>
                    <span role={"button"} tabIndex={-1} onClick={this.handleHideClick}>
                        <EyeInvisibleOutlined/>
                    </span>
                </div>
            </div>
        );
    }
}