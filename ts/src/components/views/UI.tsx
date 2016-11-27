import * as React from "react";

export class Button extends React.Component<{
        text: string,
        disabled?: boolean,
        onClick?: ()=>{},
        id?: string,
        className?: string
    }, {}> {
    constructor(props: any) {
        super(props)
    }

    handleOnClick = () => {
        this.props.onClick()
    }

    render() {
        return (
            <button
                id={this.props.id}
                onClick={typeof this.props.onClick == "function" ? this.handleOnClick.bind(this) : null}
                className={"button" + (this.props.className ? " " + this.props.className : "")}>
                    {this.props.text}
            </button>
        )
    }
}

export class TextInput extends React.Component<{
        id?: string,
        placeholder?: string,
        value?: string,
        onChange?: (e: any)=>void,
        onBlur?: (e: any)=>void,
        name?: string
    },{

    }> {

    handleOnChange = (e: any) => {
        this.props.onChange(e)
    }

    handleOnBlur = (e: any) => {
        this.props.onChange(e)
    }

    render() {
        return (
            <input
                type="text"
                id={this.props.id}
                value={this.props.value}
                placeholder={this.props.placeholder}
                onChange={typeof this.props.onChange == "function" ? this.handleOnChange.bind(this) : null}
                onBlur={typeof this.props.onBlur == "function" ? this.handleOnBlur.bind(this) : null}/>
        )
    }
}