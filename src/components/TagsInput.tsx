import * as React from "react";
import '../styles/TagsInput.css';
import {Input, Tag} from "antd";
import {PlusOutlined, CloseCircleFilled} from '@ant-design/icons';


interface TagsInputProps {
    items?: string[];
    onChange?: (items: string[]) => void;
    className?: string;
}

interface TagsInputState {
    items: string[];
    editInputIndex?: number;
    editInputValue?: string;
    newInputValue?: string;
    isInputVisible: boolean
}

class TagsInput extends React.Component<TagsInputProps, TagsInputState> {
    constructor(props: TagsInputProps) {
        super(props);
        this.state = {
            items: props.items || [],
            isInputVisible: false,
        }
    }

    componentDidUpdate(prevProps: TagsInputProps, prevState: TagsInputState): void {

    }

    handleChange = () => {
        this.props.onChange && this.props.onChange(this.state.items);
    }

    handleRemove = (tagToRemove: string) => {
        this.setState({items: this.state.items.filter(tag => tag !== tagToRemove)});
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
        this.setState({items: []}, this.handleChange);
    }

    render() {
        return (
            <div className={"TagsInput ant-input-affix-wrapper " + (this.props.className || "")}>
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
                                    <span
                                        onClick={e => {
                                            this.setState({editInputIndex: index, editInputValue:tag})
                                            e.preventDefault();
                                        }}
                                    >
                                        {tag}
                                    </span>
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
                    !this.state.isInputVisible && (
                        <Tag
                            className="site-tag-plus"
                            onClick={() => this.setState({isInputVisible: true})}
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