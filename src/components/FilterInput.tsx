import {Button, Tag, Select, InputNumber, Input} from "antd";
import * as React from "react";
import '../styles/FilterInput.css';
import {CloseCircleFilled, CloseOutlined, PlusOutlined} from '@ant-design/icons';
import _ from "lodash";

export type FilterValueType = {condition?: ("and" | "or"), operation: string, value: number, category?: string};
type FilterOperationType = {key: string, label: string};
type FilterCategoryType = {key: string, label: string};

const DEFAULT_OPERATIONS: FilterOperationType[] = [
    {key: "==", label: "Равно"},
    {key: "!=", label: "Не равно"},
    {key: ">",  label: "Больше"},
    {key: ">=", label: "Больше или равно"},
    {key: "<",  label: "Меньше"},
    {key: "<=", label: "Меньше или равно"},
];

interface FilterInputProps {
    items?: FilterValueType[];
    operations?: FilterOperationType[];
    categories?: FilterCategoryType[];
    onChange?: (value: FilterValueType[]) => void;
    className?: string;
    disabled?: boolean;
}

interface FilterInputState {
    items: FilterValueType[];
}

class FilterInput extends React.Component<FilterInputProps, FilterInputState> {
    id: string;

    constructor(props: FilterInputProps) {
        super(props)
        this.state = {
            items: props.items || [],
        }
        this.id = _.uniqueId("FilterInput")
    }

    handleChange = () => {
        this.props.onChange && this.props.onChange(this.state.items);
    }

    handleDelete = (i: number) => {
        this.setState({items: this.state.items.filter((_, j) => i !== j)}, this.handleChange)
    }

    handleAdd = () => {
        if (this.props.disabled) {
            return;
        }
        const firstOperation: string = (this.props.operations || DEFAULT_OPERATIONS)[0].key;
        let firstCategory: string | undefined = (this.props.categories && this.props.categories.length > 0) ? this.props.categories[0].key : undefined;
        const newValue: FilterValueType = {
            condition: this.state.items.length > 0 ? "and" : undefined,
            operation: firstOperation,
            value: 0,
            category: firstCategory,
        };
        const items = [...this.state.items, newValue];
        this.setState({items}, this.handleChange);
    }

    handleFieldChange = (field: string, i: number, newValue: string | number) => {
        this.setState({items: this.state.items.map((item, j) => {
            if (i !== j) {
                return item;
            } else {
                // @ts-ignore
                item[field] = newValue;
                return item;
            }
        })}, this.handleChange);
    }

    handleClear = () => {
        if (this.props.disabled) {
            return;
        }
        this.setState({items: []}, this.handleChange);
    }

    render = () => {
        const containerClassName = "TagsInput ant-input-affix-wrapper " + (this.props.disabled ? "ant-input-affix-wrapper-disabled " : "") + (this.props.className || "");
        return (
            <span className={containerClassName} key={this.id}>
                {
                    this.state.items.map((item, index) => {
                        return (
                            <div className={"FilterItem"} >
                                <Input.Group compact key={this.id+"_"+index}>
                                    {
                                        index !== 0 && (
                                            <Select
                                                className={"FilterItem--condition"}
                                                value={item.condition}
                                                dropdownMatchSelectWidth={false}
                                                size={"small"}
                                                onChange={(selectedKey) => this.handleFieldChange("condition", index, selectedKey)}
                                            >
                                                <Select.Option value="and">И</Select.Option>
                                                <Select.Option value="or">Или</Select.Option>
                                            </Select>
                                        )
                                    }
                                    <Select
                                        className={"FilterItem--operation"}
                                        value={item.operation}
                                        dropdownMatchSelectWidth={false}
                                        size={"small"}
                                        onChange={(selectedKey) => this.handleFieldChange("operation", index, selectedKey)}
                                    >
                                        {
                                            (this.props.operations || DEFAULT_OPERATIONS).map(operation =>
                                                <Select.Option value={operation.key}>{operation.label}</Select.Option>
                                            )
                                        }
                                    </Select>
                                    <InputNumber
                                        className={"FilterItem--value"}
                                        min={0}
                                        value={item.value}
                                        size={"small"}
                                        onChange={(newValue) => this.handleFieldChange("value", index, newValue)}
                                    />
                                    {
                                        this.props.categories && (
                                            <Select
                                                className={"FilterItem--category"}
                                                value={item.category}
                                                dropdownMatchSelectWidth={false}
                                                size={"small"}
                                                onChange={(selectedKey) => this.handleFieldChange("category", index, selectedKey)}
                                            >
                                                {
                                                    (this.props.categories).map(category =>
                                                        <Select.Option value={category.key}>{category.label}</Select.Option>
                                                    )
                                                }
                                            </Select>
                                        )
                                    }
                                    <Button
                                        className={"FilterItem--delete"}
                                        onClick={() => this.handleDelete(index)}
                                        size={"small"}
                                    >
                                        <CloseOutlined/>
                                    </Button>
                                </Input.Group>
                            </div>
                        );
                    })
                }
                <Tag className="site-tag-plus" onClick={this.handleAdd} key={this.id + "_add"}>
                    <PlusOutlined/>
                </Tag>
                {
                    this.state.items.length > 0 && (
                        <span className={"Filter-suffix"}>
                            <span
                                className={"ant-input-clear-icon"}
                                role={"button"}
                                tabIndex={-1}
                                onClick={this.handleClear}
                            >
                                <CloseCircleFilled key={this.id + "_clear"}/>
                            </span>
                        </span>
                    )
                }
            </span>
        );
    }
}

export default FilterInput;