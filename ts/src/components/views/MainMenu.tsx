/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import {Button} from "./UI"
import {View} from "../models/View"
import {Board} from "./Board"

export class MainMenu extends React.Component<{
        changeView: (newVew: View)=>void
    }, {
    }> {

    handleStartClick = () => {
        {this.props.changeView(new View(Board))}
    }

    render() {
        return (
            <div id="view-main-menu" className="view">
                <Button text="Start" onClick={this.handleStartClick.bind(this)}></Button>
            </div>
        )
    }
}