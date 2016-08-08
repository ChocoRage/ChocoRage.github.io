import * as React from "react";
import {LayoutModel, MainMenuLayout} from "../models/LayoutModel";
import {Button} from "../views/UI"

export class Layout extends React.Component<{
        layout: LayoutModel
    }, {
    }> {

    constructor(props: any) {
        super(props)
        this.state = {
        }
    }

    render() {
        return  (
            <div id="layout">
                {this.props.layout.getLayout()}
                {this.props.children}
            </div>
        )
    }
}