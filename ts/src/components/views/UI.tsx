import * as React from "react";

export class Button extends React.Component<{
        text: string,
        disabled?: boolean,
        onClick: ()=>{}
    }, {}> {
    constructor(props: any) {
        super(props)
    }

    render() {
        return (
            <button className="button" onClick={this.props.onClick.bind(this)}>{this.props.text}</button>
        )
    }
}