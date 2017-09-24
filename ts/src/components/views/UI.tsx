import * as React from "react";

export class Button extends React.Component<{
        text: string,
        disabled?: boolean,
        onClick?: ()=>{},
        id?: string,
        className?: string,
        active?: boolean,
        style?: {},
        badgeText?: string[],
        pathProps?: {}
    }, {}> {
    constructor(props: any) {
        super(props)
    }

    handleOnClick = () => {
        this.props.onClick()
    }

    render() {
        var onClick = typeof this.props.onClick == "function" ? this.handleOnClick.bind(this) : null
        var className = (this.props.className ? this.props.className : "button") + (this.props.active ? " button-active" : "")

        return (
            <div className="button-container">
                {this.props.pathProps ?
                    <svg className={className} style={this.props.style}>
                        <path
                            onClick={onClick}
                            className={this.props.active ? "button-svg-active": ""}
                            {...this.props.pathProps}/>
                    </svg>
                    :
                    <button
                        id={this.props.id}
                        onClick={onClick}
                        className={className}
                        style={this.props.style}>
                            {this.props.text}
                            {this.props.active ? 
                                <span className="button-active-indicator"/> : null
                            }
                    </button>
                }
                {this.props.badgeText ?
                    <div className="button-badge">
                        {this.props.badgeText.map((badgeTextLine, index) => 
                            <div className="button-badge-line" key={index}>
                                {badgeTextLine}
                            </div>
                        )}
                    </div>
                    : null
                }
            </div>
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