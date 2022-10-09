import React from 'react';
import {Col, message, Progress, Row, Switch} from "antd";
import 'material-icons/iconfont/material-icons.css';
import "./styles/Fonts.css"
import "./styles/Scrollbar.css"
import "./styles/App.css"
import "./styles/Grid.css"
import MainForm from "./components/MainForm";
import {AgGridReact} from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {ColDef, ColumnApi, ColumnVisibleEvent, GridApi, GridReadyEvent} from "ag-grid-community";
import Model from "./Model";
import {
    dateFormatter,
    HrefRenderer,
    TextAndIconRenderer,
    TagRenderer,
    TagsRenderer, ManTimeRenderer
} from "./components/CellRenderers";
import {dateComparator, keyComparator, manTimeComparator, textAndIconComparator} from "./components/Comparators";
import HeaderComponent from "./components/HeaderComponent";
import TagsInput from "./components/TagsInput";
import {EyeInvisibleOutlined} from "@ant-design/icons";

type MessageCategory = "success" | "warning" | "error";

interface AppProps {
}

interface AppState {
    theme: string;
    model: Model;
    progressPercent: number;
    progressStatus?: undefined | "exception";
    defaultColumnDefs: any;
    columnDefs: any[];
    hiddenColumnDefs: any[];
    rowData: any[];
    isLoading: boolean;
    formFinishCount: number;
    gridApi?: GridApi;
    columnApi?: ColumnApi;
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        const model = new Model({
            showMessage: this.showMessage,
            onProgressChange: this.handleProgressChange,
            onDataChange: this.handleUpdateFinish,
            fetchCount: 10,
        });
        this.state = {
            theme: localStorage.getItem("theme") || "light",
            model: model,
            progressPercent: model.state.progress,
            defaultColumnDefs: this.getDefaultColumnDefs(),
            columnDefs: this.getColumnDefs(),
            hiddenColumnDefs: [],
            rowData: [],
            isLoading: false,
            formFinishCount: 0,
        };
    }

    componentDidMount = () => {
        this.handleThemeChange(this.state.theme === "dark");
    }

    handleThemeChange = (isDarkTheme: boolean) => {
        const theme = isDarkTheme ? "dark" : "light";
        this.setState({theme});
        const container = document.getElementsByTagName("body")[0];
        localStorage.setItem("theme", theme);
        container.setAttribute("data-theme", theme);
    }

    handleGridReady = (event: GridReadyEvent) => {
        this.setState({gridApi: event.api, columnApi: event.columnApi});
    }

    handleUpdateFinish = (rowData: any[]) => {
        this.setState({rowData, isLoading: false});
    }

    handleProgressChange = (percent: number, failed: boolean) => {
        this.setState({
            progressPercent: percent,
            progressStatus: failed ? "exception" : undefined,
        });
    }

    handleFormFinish = (values: {[key: string]: any}) => {
        this.setState({isLoading: true, formFinishCount: this.state.formFinishCount+1});
        this.forceUpdate();
        this.state.model.handleSubmit(values);
    }

    showMessage = (category: MessageCategory, msg: string, duration: number = 5): void => {
        switch (category) {
            case "success": message.success(msg, duration); break;
            case "warning": message.warning(msg, duration); break;
            case "error": message.error(msg, duration); break;
        }
    }

    getDefaultColumnDefs = () => {
        return {
            resizable: true,
            sortable: true,
            wrapText: true,
            autoHeight: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
            headerComponent: HeaderComponent,
        };
    }

    getColumnDefs = () => {
        return [
            {
                field: "type",
                headerName: "Тип",
                cellRenderer: TextAndIconRenderer,
                comparator: textAndIconComparator,
            },
            {
                field: "key",
                headerName: "Задача",
                cellRenderer: HrefRenderer,
                comparator: keyComparator,
                sort: "asc",
            },
            {
                field: "priority",
                headerName: "Приоритет",
                cellRenderer: TextAndIconRenderer,
                comparator: textAndIconComparator,
            },
            {
                field: "status",
                headerName: "Статус",
                cellRenderer: TagRenderer,
            },
            {
                field: "summary",
                headerName: "Название",
            },
            {
                field: "tags",
                headerName: "Метки",
                cellRenderer: TagsRenderer,
            },
            {
                field: "assignee",
                headerName: "Исполнитель",
                cellRenderer: TextAndIconRenderer,
                comparator: textAndIconComparator,
            },
            {
                field: "reopenCount",
                headerName: "Реопенов",
            },
            {
                field: "returnAnalytics",
                headerName: "Возвратов в аналитику",
            },
            {
                field: "returnDevelopment",
                headerName: "Возвратов в разработку",
            },
            {
                field: "returnTesting",
                headerName: "Возвратов в тестирование",
            },
            {
                field: "manTime",
                headerName: "Оценка / Расход",
                cellRenderer: ManTimeRenderer,
                comparator: manTimeComparator,
            },
            {
                field: "dateCreated",
                headerName: "Открыто",
                valueFormatter: dateFormatter,
                comparator: dateComparator,
            },
            {
                field: "dateRelease",
                headerName: "Срок исполнения",
                valueFormatter: dateFormatter,
                comparator: dateComparator,
            },
            {
                field: "dateUpdated",
                headerName: "Последнее изменение",
                valueFormatter: dateFormatter,
                comparator: dateComparator,
            },
        ];
    }

    handleColumnsVisibilityChanged = (event: ColumnVisibleEvent) => {
        this.setState({hiddenColumnDefs: event.api.getColumnDefs()?.filter((cd: ColDef) => cd.hide) || []});
    }

    makeColumnVisible = (headerName: string) => {
        const colId = this.state.columnDefs.find(cd => cd.headerName === headerName).field;
        this.state.columnApi?.setColumnVisible(colId, true);
    }

    renderHiddenColumns = () => {
        if (this.state.isLoading || this.state.rowData.length === 0 || this.state.hiddenColumnDefs.length === 0) {
            return null;
        }

        const items = this.state.hiddenColumnDefs.map((cd: ColDef) => cd.headerName || cd.field || "");
        return (
            <TagsInput
                items={items}
                onRemove={this.makeColumnVisible}
                prefix={<EyeInvisibleOutlined className={"hidden-columns-prefix"}/>}
            />
        );
    }

    renderGrid = () => {
        if (this.state.isLoading || this.state.rowData.length === 0) {
            return null;
        }

        return (
            <div className={"dataset-grid ag-theme-alpine" + (this.state.theme === "dark" ? "-dark" : "")}>
                <AgGridReact
                    onGridReady={this.handleGridReady}
                    rowData={this.state.rowData}
                    columnDefs={this.state.columnDefs}
                    defaultColDef={this.state.defaultColumnDefs}
                    multiSortKey={'ctrl'}
                    onColumnVisible={this.handleColumnsVisibilityChanged}
                    rowBuffer={30}
                />
            </div>
        );
    }

    renderProgressBar = () => {
        if (!this.state.isLoading && !this.state.model.isUpdateFailed()) {
            return null;
        }
        return (
            <Progress
                percent={this.state.progressPercent}
                status={this.state.progressStatus}
            />
        );
    }

    renderContent = () => {
        return (
            <div className={"main"}>
                <Row>
                    <Col span={24}>
                        <MainForm
                            onFinish={this.handleFormFinish}
                            isLoading={this.state.isLoading}
                            isExportButtonVisible={this.state.rowData.length !== 0 && !this.state.isLoading}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {this.renderProgressBar()}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {this.renderHiddenColumns()}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {this.renderGrid()}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {this.renderNoData()}
                    </Col>
                </Row>
            </div>
        );
    }

    renderNoData = () => {
        if (this.state.rowData.length !== 0 || this.state.isLoading || this.state.formFinishCount === 0) {
            return null;
        }
        let message = (
            <>
                <p>Ничего не найдено</p>
                <p>Попробуйте ослабить фильтры</p>
            </>
        );
        if (this.state.model.isUpdateFailed()) {
            message = <p>Во время загрузки данных произошла ошибка</p>;
        }

        return (
            <div className={"no-data"}>
                <svg width="700px" height="700px" version="1.1" viewBox="0 0 700 700" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <path d="m502.43 425.07c-2.2656-2.2188-5.0859-3.7812-8.168-4.5195-3.082-0.74219-6.3086-0.62891-9.332 0.32031l-33.25-33.426c34.688-39.039 46.422-93.379 30.934-143.25-15.488-49.871-55.941-88.008-106.64-100.53-50.699-12.52-104.25 2.3945-141.18 39.324-36.926 36.926-51.84 90.48-39.32 141.18 12.523 50.699 50.66 91.152 100.53 106.64 49.875 15.488 104.21 3.7539 143.25-30.934l33.426 33.426c-1.5977 5.8945-0.007812 12.195 4.1992 16.625l38.5 38.324c3.2578 3.2344 7.6602 5.0547 12.25 5.0742 4.6523 0.027343 9.1211-1.7969 12.426-5.0742 3.2578-3.2773 5.0898-7.7148 5.0898-12.336 0-4.625-1.832-9.0586-5.0898-12.34zm-253.93-43.574c-24.637-24.605-38.484-57.992-38.5-92.812-0.015625-34.816 13.809-68.215 38.422-92.84 24.617-24.629 58.008-38.465 92.828-38.465s68.211 13.836 92.828 38.465c24.613 24.625 38.438 58.023 38.422 92.84-0.015625 34.82-13.863 68.207-38.5 92.812-24.586 24.621-57.953 38.457-92.75 38.457s-68.164-13.836-92.75-38.457z"/>
                        <path d="m273.88 286.12c1.5859 1.6914 3.8047 2.6523 6.125 2.6523s4.5391-0.96094 6.125-2.6523l11.375-11.199 11.375 11.199c1.5859 1.6914 3.8047 2.6523 6.125 2.6523s4.5391-0.96094 6.125-2.6523c1.6914-1.5859 2.6523-3.8047 2.6523-6.125s-0.96094-4.5391-2.6523-6.125l-11.199-11.375 11.199-11.375c3.3828-3.3828 3.3828-8.8672 0-12.25s-8.8672-3.3828-12.25 0l-11.375 11.199-11.375-11.199c-3.3828-3.3828-8.8672-3.3828-12.25 0s-3.3828 8.8672 0 12.25l11.199 11.375-11.199 11.375c-1.6914 1.5859-2.6523 3.8047-2.6523 6.125s0.96094 4.5391 2.6523 6.125z"/>
                        <path d="m361.38 286.12c1.5859 1.6914 3.8047 2.6523 6.125 2.6523s4.5391-0.96094 6.125-2.6523l11.375-11.199 11.375 11.199c1.5859 1.6914 3.8047 2.6523 6.125 2.6523s4.5391-0.96094 6.125-2.6523c1.6914-1.5859 2.6523-3.8047 2.6523-6.125s-0.96094-4.5391-2.6523-6.125l-11.199-11.375 11.199-11.375c3.3828-3.3828 3.3828-8.8672 0-12.25s-8.8672-3.3828-12.25 0l-11.375 11.199-11.375-11.199c-3.3828-3.3828-8.8672-3.3828-12.25 0s-3.3828 8.8672 0 12.25l11.199 11.375-11.199 11.375c-1.6914 1.5859-2.6523 3.8047-2.6523 6.125s0.96094 4.5391 2.6523 6.125z"/>
                        <path d="m411.25 315h-140c-4.832 0-8.75 3.918-8.75 8.75s3.918 8.75 8.75 8.75h26.25v26.25c0 9.3789 5.0039 18.043 13.125 22.734 8.1211 4.6875 18.129 4.6875 26.25 0 8.1211-4.6914 13.125-13.355 13.125-22.734v-26.25h61.25c4.832 0 8.75-3.918 8.75-8.75s-3.918-8.75-8.75-8.75zm-78.75 43.75c0 4.832-3.918 8.75-8.75 8.75s-8.75-3.918-8.75-8.75v-26.25h17.5z"/>
                        <path d="m516.25 87.5c-11.602 0-22.73 4.6094-30.938 12.812-8.2031 8.207-12.812 19.336-12.812 30.938s4.6094 22.73 12.812 30.938c8.207 8.2031 19.336 12.812 30.938 12.812s22.73-4.6094 30.938-12.812c8.2031-8.207 12.812-19.336 12.812-30.938s-4.6094-22.73-12.812-30.938c-8.207-8.2031-19.336-12.812-30.938-12.812zm0 70c-6.9609 0-13.641-2.7656-18.562-7.6875s-7.6875-11.602-7.6875-18.562 2.7656-13.641 7.6875-18.562 11.602-7.6875 18.562-7.6875 13.641 2.7656 18.562 7.6875 7.6875 11.602 7.6875 18.562-2.7656 13.641-7.6875 18.562-11.602 7.6875-18.562 7.6875z"/>
                        <path d="m227.5 105c0-9.2812-3.6875-18.184-10.25-24.75-6.5664-6.5625-15.469-10.25-24.75-10.25s-18.184 3.6875-24.75 10.25c-6.5625 6.5664-10.25 15.469-10.25 24.75s3.6875 18.184 10.25 24.75c6.5664 6.5625 15.469 10.25 24.75 10.25s18.184-3.6875 24.75-10.25c6.5625-6.5664 10.25-15.469 10.25-24.75zm-52.5 0c0-4.6406 1.8438-9.0938 5.125-12.375s7.7344-5.125 12.375-5.125 9.0938 1.8438 12.375 5.125 5.125 7.7344 5.125 12.375-1.8438 9.0938-5.125 12.375-7.7344 5.125-12.375 5.125-9.0938-1.8438-12.375-5.125-5.125-7.7344-5.125-12.375z"/>
                        <path d="m218.75 455h-8.75v-8.75c0-4.832-3.918-8.75-8.75-8.75s-8.75 3.918-8.75 8.75v8.75h-8.75c-4.832 0-8.75 3.918-8.75 8.75s3.918 8.75 8.75 8.75h8.75v8.75c0 4.832 3.918 8.75 8.75 8.75s8.75-3.918 8.75-8.75v-8.75h8.75c4.832 0 8.75-3.918 8.75-8.75s-3.918-8.75-8.75-8.75z"/>
                    </g>
                </svg>
                {message}
            </div>
        );
    }

    renderHeader = () => {
        return (
            <div className={"header"}>
                <div className={"logo"}>JiraTrack</div>
                <Switch
                    className={"theme-switch"}
                    checkedChildren={<span className="material-icons-outlined">dark_mode</span>}
                    unCheckedChildren={<span className="material-icons-outlined">light_mode</span>}
                    defaultChecked={this.state.theme === "dark"}
                    onChange={this.handleThemeChange}
                />
            </div>
        );
    }

    renderFooter = () => {
        const year = new Date().getFullYear();
        return (
            <div className={"footer"}>
                <p><HrefRenderer value={{href: "https://github.com/catinwarmhands/JiraTrack", text: "JiraTrack"}}/></p>
                <p>Created by <HrefRenderer value={{href: "https://github.com/catinwarmhands", text: "Lev Buimistriuk"}}/> at <HrefRenderer value={{href: "https://www.neoflex.ru/", text: "Neoflex"}}/> {"©" + year}</p>
            </div>
        );
    }

    render = () => {
        return (
            <div className="App">
                {this.renderHeader()}
                {this.renderContent()}
                {this.renderFooter()}
            </div>
        );
    }
}


export default App;
