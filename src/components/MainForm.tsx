import {Button, Col, DatePicker, Form, Input, Row, Select, Tooltip} from "antd";
import * as React from "react";
import '../styles/MainForm.css';
import {LockOutlined, UserOutlined, LinkOutlined, UnorderedListOutlined, DownloadOutlined } from '@ant-design/icons';
import {Tree} from 'antd';
import type {DataNode} from 'antd/es/tree';
import TagsInput from "./TagsInput";
import FilterInput from "./FilterInput";
import {splitList} from "../utils";

interface MainFormProps {
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

    updateDimensions = () => {
        const oldColumnsCount = this.state.columnsCount;
        const newColumnsCount = Math.max(Math.floor(window.innerWidth / 600), 1);
        if (oldColumnsCount !== newColumnsCount || this.state.filtersChunks.length === 0) {
            const filters = this.getFiltersList();
            const filtersColumnsCount = Math.min(newColumnsCount-1, filters.length);
            this.setState({
                columnsCount: newColumnsCount,
                filtersChunks: splitList(filters, filtersColumnsCount, "left"),
            });
            console.log(oldColumnsCount, newColumnsCount)
        }
    };

    handleFinish = (values: any) => {
        console.log(values);
    }

    handleFinishFailed = (errorInfo: any) => {
        console.log(errorInfo);
    }

    handleStatusCheck = (checked: any) => {
        console.log(checked);
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
            (
                <Form.Item
                    name="issues"
                    label={"Номера задач"}
                    valuePropName={"items"}
                >
                    <TagsInput/>
                </Form.Item>
            ),
            (
                <Form.Item
                    label="Дата открытия задачи"
                    name="dateOpen"
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
                    label="Статус"
                    name="status"
                    trigger={"onCheck"}
                    valuePropName={"defaultCheckedKeys"}
                >
                    <Tree
                        checkable={true}
                        selectable={false}
                        // defaultExpandedKeys={["all"]}
                        onCheck={this.handleStatusCheck}
                        treeData={treeData}
                    />
                </Form.Item>
            ),
            (
                <Form.Item label={"Метки"}>
                    <Input.Group compact>
                        <Form.Item
                            name="tags"
                            valuePropName={"items"}
                            noStyle
                        >
                            <TagsInput className={"MainForm--tags"}/>
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
                    <FilterInput/>
                </Form.Item>
            ),
            (
                <Form.Item
                    label="Количество и тип возвратов"
                    name="returnFilters"
                    valuePropName={"items"}
                >
                    <FilterInput
                        categories={[
                            {key: "any", label: "Любых"},
                            {key: "analytics", label: "На аналитику"},
                            {key: "development", label: "На разработку"},
                            {key: "testing", label: "На тестирование"},
                        ]}
                    />
                </Form.Item>
            ),
        ];
    }

    render = () => {
        const columnsCount = Math.min(this.state.columnsCount, this.state.filtersChunks.length+1);
        const colSpan = Math.floor(24/columnsCount);
        const leftoverSpan = 24 - colSpan * columnsCount;

        const labelSpans = [4];
        const labelSpan = labelSpans[Math.min(columnsCount-1, labelSpans.length-1)];

        const main = (
            <>
                <Form.Item
                    label="Адрес Jira"
                    name="jiraUrl"
                    rules={[{ required: true, message: 'Пожалуйста, введите адрес Jira' }]}
                >
                    <Input
                        allowClear
                        prefix={<LinkOutlined className="site-form-item-icon"/>}
                    />
                </Form.Item>

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

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{ required: true, message: 'Пожалуйста, введите свой пароль от Jira' }]}
                >
                    <Input.Password
                        allowClear
                        autoComplete="new-password"
                        prefix={<LockOutlined className="site-form-item-icon"/>}
                    />
                </Form.Item>

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
            </>
        );

        const buttons = (
            <Form.Item>
                <Input.Group compact>
                    <Button type="primary" htmlType="submit">
                        Сформировать
                    </Button>
                    <Tooltip placement="right" title="Экспорт в xlsx">
                        <Button>
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
                initialValues={{
                    status: ["all"],
                    // tags: ["hello", "world1"],
                    tagsMode: "any",
                    assigneeMode: "any",
                    // reopenFilters: [{operation: "==", value: 1},{condition: "or", operation: ">", value: 5},],
                    // returnFilters: [{operation: "==", value: 1, category: "any"},{condition: "or", operation: ">", value: 5, category: "development"},],
                }}
                onFinish={this.handleFinish}
                onFinishFailed={this.handleFinishFailed}
                colon={false}
            >
                <Row gutter={10}>
                    <Col span={colSpan}>
                        {main}
                    </Col>
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
                    <Col span={24}>
                        {buttons}
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default MainForm;