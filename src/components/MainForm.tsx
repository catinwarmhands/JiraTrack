import {Button, Col, DatePicker, Form, Input, Row, Select, Spin, Tooltip, Tree} from "antd";
import * as React from "react";
import '../styles/MainForm.css';
import {DownloadOutlined, LockOutlined, UnorderedListOutlined, UserOutlined} from '@ant-design/icons';
import type {DataNode} from 'antd/es/tree';
import TagsInput from "./TagsInput";
import FilterInput from "./FilterInput";
import {parseJSON, splitList} from "../utils";
import _ from "lodash";
import { RuleObject } from "antd/lib/form";

const validateNoSpaces = (_: RuleObject, values: string[]) => {
    if (values) {
        for (const value of values) {
            if (/\s/.test(value)) {
                return Promise.reject();
            }
        }
    }
    return Promise.resolve();
}

const validateOnlyDigits = (_: RuleObject, values: string[]) => {
    if (values) {
        for (const value of values) {
            if (!/^[\d\s]+$/.test(value)) {
                return Promise.reject();
            }
        }
    }
    return Promise.resolve();
}

interface MainFormProps {
    onFinish: (values: {[key: string]: any}) => void;
    isLoading: boolean;
    isExportButtonVisible: boolean;
}

interface MainFormState {
    columnsCount: number;
    filtersChunks: JSX.Element[][];
}

class MainForm extends React.Component<MainFormProps, MainFormState> {
    constructor(props: MainFormProps) {
        super(props);
        this.state = {
            columnsCount: 1,
            filtersChunks: []
        }
    }

    componentDidMount = () => {
        window.addEventListener('resize', this.updateDimensions);
        this.updateDimensions();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    componentDidUpdate(prevProps: Readonly<MainFormProps>, prevState: Readonly<MainFormState>) {
        if (this.props.isLoading !== prevProps.isLoading) {
            this.calculateFiltersChunks(this.state.columnsCount);
        }
    }

    updateDimensions = () => {
        const oldColumnsCount = this.state.columnsCount;
        const newColumnsCount = Math.max(Math.floor(window.innerWidth / 600), 1);
        if (oldColumnsCount !== newColumnsCount || this.state.filtersChunks.length === 0) {
            this.calculateFiltersChunks(newColumnsCount);
        }
    };

    calculateFiltersChunks = (newColumnsCount: number) => {
        const filters = this.getFiltersList();
        const filtersColumnsCount = Math.min(newColumnsCount, filters.length);
        this.setState({
            columnsCount: newColumnsCount,
            filtersChunks: splitList(filters, filtersColumnsCount, "left"),
        });
    }

    getFiltersList = (): JSX.Element[] => {
        const treeData: DataNode[] = [{
            title: 'Все',
            key: 'all',
            children: [
                {
                    title: 'Открыто',
                    key: 'open',
                },
                {
                    title: 'Закрыто',
                    key: 'closed',
                },
                {
                    title: 'Решено',
                    key: 'resolved',
                },
                {
                    title: 'Релиз',
                    key: 'release',
                },
                {
                    title: 'В работе (внешняя)',
                    key: 'in progress ext',
                },
                {
                    title: 'Аналитика',
                    key: 'analytics',
                    children: [
                        {
                            title: 'В очереди на аналитику',
                            key: 'analytics backlog',
                        },
                        {
                            title: 'В работе',
                            key: 'analytics in progress',
                        },
                    ],
                },
                {
                    title: 'Разработка',
                    key: 'development',
                    children: [
                        {
                            title: 'В очереди на разработку',
                            key: 'development backlog',
                        },
                        {
                            title: 'В работе',
                            key: 'development in progress',
                        },
                    ],
                },
                {
                    title: 'Тестирование',
                    key: 'testing',
                    children: [
                        {
                            title: 'В очереди на тестирование',
                            key: 'testing backlog',
                        },
                        {
                            title: 'В работе',
                            key: 'testing in progress',
                        },
                    ],
                },
            ],
        }];
        return [
            // (
            //     <Form.Item
            //         label="Адрес Jira"
            //         name="jiraUrl"
            //         rules={[{ required: true, message: 'Пожалуйста, введите url Jira' }]}
            //     >
            //         <Input
            //             allowClear
            //             prefix={<LinkOutlined className="site-form-item-icon"/>}
            //         />
            //     </Form.Item>
            // ),
            (
                <Form.Item
                    label="Логин"
                    name="username"
                    rules={[{ required: true, message: 'Пожалуйста, введите свой логин от Jira' }]}
                >
                    <Input
                        allowClear
                        autoComplete="off"
                        prefix={<UserOutlined className="site-form-item-icon"/>}
                    />
                </Form.Item>
            ),
            (
                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{ required: true, message: 'Пожалуйста, введите свой пароль от Jira' }]}
                >
                    <Input.Password
                        allowClear
                        // autoComplete="new-password"
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                    />
                </Form.Item>
            ),
            (
                <Form.Item
                    label="Проект"
                    name="project"
                    rules={[{ required: true, message: 'Пожалуйста, введите название проекта в Jira' }]}
                >
                    <Input
                        allowClear
                        prefix={<UnorderedListOutlined className="site-form-item-icon"/>}
                    />
                </Form.Item>
            ),
            (
                <Form.Item
                    name="issues"
                    label={"Номера задач"}
                    valuePropName={"items"}
                    rules={[
                        {message: 'Номер задачи не может содержать пробел', validator: validateNoSpaces},
                        {message: 'Номер задачи может состоять только из цифр', validator: validateOnlyDigits}
                    ]}
                >
                    <TagsInput addable={true} editable={true}/>
                </Form.Item>
            ),
            (
                <Form.Item label={"Метки"}>
                    <Input.Group compact>
                        <Form.Item
                            name="tags"
                            valuePropName={"items"}
                            noStyle
                            rules={[{message: 'Метка не может содержать пробел', validator: validateNoSpaces}]}
                        >
                            <TagsInput
                                className={"MainForm--tags"}
                                disabled={this.props.isLoading}
                                addable={true}
                                editable={true}
                            />
                        </Form.Item>

                        <Form.Item name="tagsMode" noStyle>
                            <Select dropdownMatchSelectWidth={false} className={"MainForm--tagsMode"}>
                                <Select.Option value="any">Любые</Select.Option>
                                <Select.Option value="all">Все</Select.Option>
                            </Select>
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
            ),
            (
                <Form.Item label={"Исполнитель"}>
                    <Input.Group compact>
                        <Form.Item
                            name={"assignee"}
                            noStyle
                        >
                            <Input
                                allowClear
                                prefix={<UserOutlined className="site-form-item-icon"/>}
                                className={"MainForm--assignee"}
                            />
                        </Form.Item>
                        <Form.Item
                            name={"assigneeMode"}
                            noStyle
                        >
                            <Select dropdownMatchSelectWidth={false} className={"MainForm--assigneeMode"}>
                                <Select.Option value="any">Текущий или бывший</Select.Option>
                                <Select.Option value="is">Текущий</Select.Option>
                                <Select.Option value="was">Бывший</Select.Option>
                            </Select>
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
            ),
            (
                <Form.Item
                    label="Количество реопенов"
                    name="reopenFilters"
                    valuePropName={"items"}
                >
                    <FilterInput disabled={this.props.isLoading}/>
                </Form.Item>
            ),
            (
                <Form.Item
                    label="Количество и тип возвратов"
                    name="returnFilters"
                    valuePropName={"items"}
                >
                    <FilterInput
                        disabled={this.props.isLoading}
                        categories={[
                            {key: "any", label: "Любых"},
                            {key: "analytics", label: "На аналитику"},
                            {key: "development", label: "На разработку"},
                            {key: "testing", label: "На тестирование"},
                        ]}
                    />
                </Form.Item>
            ),
            (
                <Form.Item
                    label="Дата открытия задачи"
                    name="dateCreated"
                >
                    <DatePicker.RangePicker
                        allowEmpty={[true, true]}
                        format={"DD.MM.yyyy"}
                        placeholder={["С", "По"]}
                        className={"MainForm--datepicker"}
                    />
                </Form.Item>
            ),
            (
                <Form.Item
                    label="Дата плановой поставки"
                    name="dateRelease"
                >
                    <DatePicker.RangePicker
                        allowEmpty={[true, true]}
                        format={"DD.MM.yyyy"}
                        placeholder={["С", "По"]}
                        className={"MainForm--datepicker"}
                    />
                </Form.Item>
            ),
            (
                <Form.Item
                    label="Дата последнего изменения"
                    name="dateUpdated"
                >
                    <DatePicker.RangePicker
                        allowEmpty={[true, true]}
                        format={"DD.MM.yyyy"}
                        placeholder={["С", "По"]}
                        className={"MainForm--datepicker"}
                    />
                </Form.Item>
            ),
            (
                <Form.Item
                    label="Статус"
                    name="status"
                    trigger={"onCheck"}
                    valuePropName={"defaultCheckedKeys"}
                >
                    <Tree
                        checkable={true}
                        selectable={false}
                        treeData={treeData}
                    />
                </Form.Item>
            ),
        ];
    }

    saveValuesToLocalStorage = (values: {[key: string]: any}): void => {
        for (const key in values) {
            let value = values[key]
            // if (key === "password") {
            //     continue;
            // }
            if (
                value === undefined
                || value === null
                || (_.isString(value) && value.trim() === "")
                || (_.isArray(value) && value.length === 0)
            ) {
                localStorage.removeItem(key);
                continue;
            }
            if (_.isArray(value)) {
                value = JSON.stringify(value);
            }
            localStorage.setItem(key, value);
        }
    }

    getValuesFromLocalStorage = (): {[key: string]: any} => {
        let result: {[key: string]: any} = {};
        for (const key in localStorage) {
            result[key] = parseJSON(localStorage.getItem(key));
        }
        // result.jiraUrl = result.jiraUrl || "https://neojira.neoflex.ru/secure/Dashboard.jspa";
        result.status = result.status || ["all"];
        result.tagsMode = result.tagsMode || "any";
        result.assigneeMode = result.assigneeMode || "any";
        result.project = result.project || "NEODEV";
        return result;
    }

    handleFormFinish = (values: {[key: string]: any}): void => {
        if (values.assignee) {
            values.assignee = values.assignee.trim();
        }
        this.saveValuesToLocalStorage(values);
        this.props.onFinish(values);
    }

    render = () => {
        const columnsCount = Math.min(this.state.columnsCount, this.state.filtersChunks.length);
        const colSpan = Math.floor(24/columnsCount);
        const leftoverSpan = 24 - colSpan * columnsCount;
        const labelSpan = 4;

        const buttons = (
            <Form.Item label=" ">
                <Input.Group compact>
                    <Button type="primary" htmlType="submit" className={"submit-button"}>
                        {this.props.isLoading ? <Spin/> : "Сформировать"}
                    </Button>
                    <Tooltip placement="right" title="Экспорт в xlsx">
                        <Button hidden={!this.props.isExportButtonVisible}>
                            <DownloadOutlined />
                        </Button>
                    </Tooltip>
                </Input.Group>
            </Form.Item>
        );

        return (
            <Form
                name="basic"
                labelCol={{span: labelSpan}}
                // initialValues={{
                //     AAAA: "test",
                //     status: ["all"],
                //     // tags: ["hello", "world1"],
                //     tagsMode: "any",
                //     assigneeMode: "any",
                //     // reopenFilters: [{operation: "==", value: 1},{condition: "or", operation: ">", value: 5},],
                //     // returnFilters: [{operation: "==", value: 1, category: "any"},{condition: "or", operation: ">", value: 5, category: "development"},],
                // }}
                initialValues={this.getValuesFromLocalStorage()}
                onFinish={this.handleFormFinish}
                colon={false}
                disabled={this.props.isLoading}
                labelWrap
            >
                <Row gutter={10}>
                    {
                        this.state.filtersChunks.map((chunk, index) =>
                            <>
                                <Col
                                    span={colSpan + (index !== this.state.filtersChunks.length-1 ? 0 : leftoverSpan)}
                                    className={"filter-col " + (columnsCount > 1 ? "filter-col-multi" : "")}
                                >
                                    {chunk}
                                </Col>
                            </>
                        )
                    }
                </Row>
                <Row>
                    <Col span={colSpan}>
                        {buttons}
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default MainForm;