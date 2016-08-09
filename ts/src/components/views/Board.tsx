/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import {Button} from "./UI"
import {View} from "../models/View"
import {MainMenu} from "./MainMenu"

export class Board extends React.Component<{
        changeView: (newVew: View)=>void
    }, {
    }> {

    handleMenuClick = () => {
        {this.props.changeView(new View(MainMenu))}
    }

    render() {
        return (
            <div id="view-board" className="view">
                <Button text="Main Menu" onClick={this.handleMenuClick.bind(this)}></Button>
            </div>
        )
    }
}