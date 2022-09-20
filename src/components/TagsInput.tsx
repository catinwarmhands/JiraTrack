import * as React from "react";
import '../styles/TagsInput.css';
import {Input, Tag} from "antd";
import {PlusOutlined, CloseCircleFilled} from '@ant-design/icons';
import _ from "lodash";


interface TagsInputProps {
    items?: string[];
    onChange?: (items: string[]) => void;
    className?: string;
    disabled?: boolean;
    addable?: boolean;
    editable?: boolean;
    onRemove?: (item: string) => void;
    prefix?: JSX.Element;
}

interface TagsInputState {
    items: string[];
    editInputIndex?: number;
    editInputValue?: string;
    newInputValue?: string;
    isInputVisible: boolean
}

class TagsInput extends React.Component<TagsInputProps, TagsInputState> {
    id: string;

    constructor(props: TagsInputProps) {
        super(props);
        this.state = {
            items: props.items || [],
            isInputVisible: false,
        }
        this.id = _.uniqueId("TagsInput")
    }

    componentDidUpdate = (prevProps: Readonly<TagsInputProps>, _prevState: Readonly<TagsInputState>) => {
        if (!_.isEqual(this.props.items, prevProps.items)) {
            this.setState({items: this.props.items || []});
        }
    }

    handleChange = () => {
        this.props.onChange && this.props.onChange(this.state.items);
    }

    handleRemove = (tagToRemove: string) => {
        this.setState({items: this.state.items.filter(tag => tag !== tagToRemove)}, this.handleChange);
        this.props.onRemove && this.props.onRemove(tagToRemove);
    }

    handleNewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({newInputValue: e.target.value});
    }

    handleNewInputConfirm = () => {
        const value = this.state.newInputValue?.trim();
        if (value && this.state.items.indexOf(value) === -1) {
            const items = [...this.state.items, value];
            this.setState({items}, this.handleChange)
        }
        this.setState({newInputValue: undefined, isInputVisible: false});
    }

    handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({editInputValue: e.target.value}, this.handleChange);
    }

    handleEditInputConfirm = () => {
        const value = this.state.editInputValue?.trim();
        if (this.state.editInputIndex !== undefined) {
            let items: string[];
            if (!value) {
                items = this.state.items.filter((tag, index) => index !== this.state.editInputIndex);
            } else {
                items = [...this.state.items];
                if (this.state.items.indexOf(value) === -1) {
                    items[this.state.editInputIndex] = value;
                }
            }
            this.setState({items}, this.handleChange)
        }
        this.setState({editInputIndex: undefined, editInputValue: undefined});
    };

    handleClear = () => {
        if (this.props.disabled) {
            return;
        }
        for (const item of this.state.items) {
            this.props.onRemove && this.props.onRemove(item);
        }
        this.setState({items: []}, this.handleChange);
    }

    handleAdd = () => {
        if (this.props.disabled) {
            return;
        }
        this.setState({isInputVisible: true});
    }

    render() {
        const containerClassName = "TagsInput ant-input-affix-wrapper " + (this.props.disabled ? "ant-input-affix-wrapper-disabled " : "") + (this.props.className || "");
        return (
            <div className={containerClassName}>
                {
                    this.props.prefix && (
                        <span className={"TagsInput-prefix"}>
                            {this.props.prefix}
                        </span>
                    )
                }
                {
                    this.state.items.map((tag, index) => {
                        if (index === this.state.editInputIndex) {
                            return (
                                <Input
                                    autoFocus
                                    key={tag}
                                    size="small"
                                    className="tag-input"
                                    value={this.state.editInputValue}
                                    onChange={this.handleEditInputChange}
                                    onBlur={this.handleEditInputConfirm}
                                    onPressEnter={this.handleEditInputConfirm}
                                />
                            );
                        } else {
                            return (
                                <Tag
                                    className="edit-tag"
                                    key={tag}
                                    closable={true}
                                    onClose={() => this.handleRemove(tag)}
                                >
                                    <div
                                        onClick={e => {
                                            if (!this.props.editable) {
                                                return;
                                            }
                                            this.setState({editInputIndex: index, editInputValue:tag})
                                            e.preventDefault();
                                        }}
                                        className={"tag-text"}
                                    >
                                        {tag}
                                    </div>
                                </Tag>
                            );
                        }
                    })
                }
                {
                    this.state.isInputVisible && (
                        <Input
                            autoFocus
                            type="text"
                            size="small"
                            className="tag-input"
                            value={this.state.newInputValue}
                            onChange={this.handleNewInputChange}
                            onBlur={this.handleNewInputConfirm}
                            onPressEnter={this.handleNewInputConfirm}
                        />
                    )
                }
                {
                    this.props.addable && !this.state.isInputVisible && (
                        <Tag
                            className="site-tag-plus"
                            key={this.id + "_add"}
                            onClick={this.handleAdd}
                        >
                            <PlusOutlined/>
                        </Tag>
                    )
                }
                {
                    this.state.items.length > 0 && (
                        <span className={"TagsInput-suffix"}>
                            <span
                                className={"ant-input-clear-icon"}
                                role={"button"}
                                tabIndex={-1}
                                onClick={this.handleClear}
                            >
                                <CloseCircleFilled/>
                            </span>
                        </span>
                    )
                }
            </div>
        );
    }
}

export default TagsInput;