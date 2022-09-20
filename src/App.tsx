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
import {GridReadyEvent} from "ag-grid-community";
import Model from "./Model";
import {
    dateFormatter,
    KeyRenderer,
    NameAndIconCompactRenderer,
    NameAndIconRenderer,
    TagRenderer,
    TagsRenderer
} from "./components/CellRenderers";
import {dateComparator, keyComparator, nameAndIconComparator} from "./components/Comparators";

interface AppProps {
}

interface AppState {
    theme: string;
    model: Model;
    progressPercent: number;
    progressStatus?: "exception";
    rowData: any[];
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        const model = new Model({
            showMessage: this.showMessage,
            onProgressChange: this.handleProgressChange,
            onDataChange: this.handleDataChange,
        });
        this.state = {
            theme: localStorage.getItem("theme") || "light",
            model: model,
            progressPercent: model.state.progress,
            rowData: [],
        };
        // this.model = new Model({});
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

    handleGridReady = (_event: GridReadyEvent) => {
        // const gridApi = event.api;
        // const columnApi = event.columnApi;
        // columnApi.autoSizeAllColumns();
    }

    handleDataChange = (rowData: any[]) => {
        this.setState({rowData});
    }

    handleProgressChange = (percent: number, failed: boolean) => {
        this.setState({
            progressPercent: percent,
            progressStatus: failed ? "exception" : undefined,
        });
    }

    handleFormFinish = (values: {[key: string]: any}) => {
        this.state.model.onStart(values);
    }

    showMessage = (category: "success" | "warning" | "error", msg: string, duration: number = 5): void => {
        switch (category) {
            case "success": message.success(msg, duration); break;
            case "warning": message.warning(msg, duration); break;
            case "error": message.error(msg, duration); break;
        }
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
                <p><a href="https://github.com/catinwarmhands/JiraTrack">JiraTrack</a></p>
                <p>Created by <a href="https://github.com/catinwarmhands">Lev Buimistriuk</a> at <a href="https://www.neoflex.ru/">Neoflex</a> {"©" + year}</p>
            </div>
        );
    }

    renderGrid = () => {
        if (this.state.rowData.length == 0) {
            return null;
        }
        /*
        Тип задачи
        Номер (гиперссылка на соответствующую задачу в Jira)
        Приоритет
        Статус
        Название
        Метки
        Количество реопенов
        Количество возвратов по категориям (“Аналитика”, “Разработка”, “Тестирование”)
        Дата открытия
        Первоначальная оценка времени
        Фактический расход времени
        Плановая дата поставки

         */
        const defaultColDef = {
            resizable: true,
            sortable: true,
            wrapText: true,
            autoHeight: true,
            wrapHeaderText: true,
            autoHeaderHeight: true,
        };
        const columnDefs = [
            {
                field: "type",
                headerName: "Тип",
                cellRenderer: NameAndIconCompactRenderer,
                comparator: nameAndIconComparator,
            },
            {
                field: "key",
                headerName: "Задача",
                cellRenderer: KeyRenderer,
                comparator: keyComparator,
            },
            {
                field: "priority",
                headerName: "Приоритет",
                cellRenderer: NameAndIconCompactRenderer,
                comparator: nameAndIconComparator,
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
                field: "reopenCount",
                headerName: "Количество реопенов",
            },
            {
                field: "reopenAnalytics",
                headerName: "Количество возвратов в аналитику",
            },
            {
                field: "reopenDevelopment",
                headerName: "Количество возвратов в разработку",
            },
            {
                field: "reopenTesting",
                headerName: "Количество возвратов в тестирование",
            },
            {
                field: "initialEstimate",
                headerName: "Первоначальная оценка",
            },
            {
                field: "factSpend",
                headerName: "Фактический расход",
            },
            {
                field: "dateCreated",
                headerName: "Дата открытия",
                valueFormatter: dateFormatter,
                comparator: dateComparator,
            },
            {
                field: "dateRelease",
                headerName: "Дата плановой поставки",
                valueFormatter: dateFormatter,
                comparator: dateComparator,
            },
            {
                field: "dateUpdated",
                headerName: "Дата последнего изменения",
                valueFormatter: dateFormatter,
                comparator: dateComparator,
            },
        ];

        return (
            <div className={"dataset-grid ag-theme-alpine" + (this.state.theme === "dark" ? "-dark" : "")}>
                <AgGridReact
                    onGridReady={this.handleGridReady}
                    rowData={this.state.rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    multiSortKey={'ctrl'}
                />
            </div>
        );
    }

    renderProgressBar = () => {
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
                        <MainForm onFinish={this.handleFormFinish}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {this.renderProgressBar()}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {this.renderGrid()}
                    </Col>
                </Row>
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
