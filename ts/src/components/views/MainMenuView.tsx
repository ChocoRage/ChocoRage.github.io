/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import {Button} from "./UI"
import {BoardView} from "./BoardView"

export class MainMenuView extends React.Component<{
    }, {
    }> {

    handleStartClick = () => {
    }

    render() {
        return (
            <div id="view-main-menu" className="view">
                <Button text="Start" onClick={this.handleStartClick.bind(this)}></Button>
            </div>
        )
    }
}