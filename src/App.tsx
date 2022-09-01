import React from 'react';
import {Col, Progress, Row, Switch} from "antd";
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

interface AppProps {
}

interface AppState {
    theme: string;
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            theme: localStorage.getItem("theme") || "light",
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

    onGridReady = (_event: GridReadyEvent) => {
        // const gridApi = event.api;
        // const columnApi = event.columnApi;
        // columnApi.autoSizeAllColumns();
    }

    renderContent = () => {
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
                // rowSpan: 2
            },
            {
                field: "ref",
                headerName: "Номер",
            },
            {
                field: "priority",
                headerName: "Приоритет",
            },
            {
                field: "status",
                headerName: "Статус",
            },
            {
                field: "name",
                headerName: "Название",
            },
            {
                field: "tags",
                headerName: "Метки",
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
                field: "dateOpen",
                headerName: "Дата открытия",
            },
            {
                field: "dateRelease",
                headerName: "Дата плановой поставки",
            },
        ];

        let rowData: any[] = [];
        for (let i = 0; i < 50; i++) {
            let obj: any = {};
            for (const def of columnDefs) {
                obj[def.field] = def.field + " " + i;
            }
            rowData.push(obj);
        }

        return (
            <div className={"main"}>
                <Row>
                    <Col span={24}>
                        <MainForm/>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Progress percent={100}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <div className={"dataset-grid ag-theme-alpine" + (this.state.theme === "dark" ? "-dark" : "")}>
                            <AgGridReact
                                onGridReady={this.onGridReady}
                                rowData={rowData}
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                multiSortKey={'ctrl'}
                            />
                        </div>
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
