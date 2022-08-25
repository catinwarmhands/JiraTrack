import * as React from "react";
import '../styles/Switcher.css';
import _ from "lodash";

type OptionType = {value: string, label?: string, disabled?: boolean};
type SwitcherSizeType = "Small" | "Default" | "Large";
type FontSizeType = "xs" | "sm" | "md";

interface SwitcherProps {
    options: OptionType[]
    value?: string
    onChange?: Function
    disabled?: boolean
    size?: SwitcherSizeType
    fontSize?: FontSizeType
}

interface SwitcherState {
    selectedValue?: string
}

class Switcher extends React.Component<SwitcherProps, SwitcherState> {
    id: string
    rootClassName: string

    constructor(props: SwitcherProps) {
        super(props);
        this.state = {
            selectedValue: props.value
        }
        this.id = _.uniqueId("switcher")
        this.rootClassName = (
            "switcher" +
            " switcher--size-" + (props.size || "Default").toLowerCase() +
            " switcher--font-" + (props.fontSize || "sm")
        );
    }

    componentDidUpdate(prevProps: SwitcherProps, prevState: SwitcherState): void {
        if (prevProps.value !== this.props.value) {
            this.setState({selectedValue: this.props.value});
        }
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedValue = e.target.value;
        this.setState({selectedValue})
        this.props.onChange && this.props.onChange(selectedValue)
    }

    render() {
        return (
            <div className={this.rootClassName}>
            {
                this.props.options.map((o:OptionType, i: number) => {
                    const inputId: string = this.id + i;
                    return (
                        <div className={"switcher-item"}>
                            <input
                                type="radio"
                                id={inputId}
                                name={this.id}
                                value={o.value}
                                disabled={o.disabled || this.props.disabled}
                                checked={o.value === (this.state.selectedValue)}
                                onChange={this.handleChange}
                            />
                            <label htmlFor={inputId}>{o.label || o.value}</label>
                        </div>
                    );
                })
            }
            </div>
        )
    }
}

export default Switcher