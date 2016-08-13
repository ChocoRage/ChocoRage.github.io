import * as React from "react";

export class Button extends React.Component<{
        text: string,
        disabled?: boolean,
        onClick: ()=>{},
        id?: string
    }, {}> {
    constructor(props: any) {
        super(props)
    }

    render() {
        return (
            <button id={this.props.id} className="button" onClick={this.props.onClick.bind(this)}>{this.props.text}</button>
        )
    }
}