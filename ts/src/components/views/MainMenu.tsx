/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import {Button} from "./UI"
import {View} from "../models/ViewModel"
import {BoardView} from "./BoardView"

export class MainMenu extends React.Component<{
        changeView: (newVew: View)=>void
    }, {
    }> {

    handleStartClick = () => {
        {this.props.changeView(new View(BoardView))}
    }

    render() {
        return (
            <div id="view-main-menu" className="view">
                <Button text="Start" onClick={this.handleStartClick.bind(this)}></Button>
            </div>
        )
    }
}