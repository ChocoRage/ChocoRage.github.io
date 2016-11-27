/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import {Button} from "./UI"
import {BoardView} from "./BoardView"
import * as GM from "../managers/GameManager"
import {PlayerModel} from "../models/PlayerModel"

export class MainMenuView extends React.Component<{
        playerModel: PlayerModel
    }, {
    }> {

    handleCreateNewGameButtonClick = () => {
        var createGameButtonClickedEvent = new GM.CreateGameButtonClickedEvent()
        GM.GameManager.createGameButtonClicked(createGameButtonClickedEvent)
    }

    render() {
        return (
            <div id="view-main-menu" className="view">
                <Button text="Create New Game" id="board-start-game-button" onClick={this.handleCreateNewGameButtonClick.bind(this)}></Button>
            </div>
        )
    }
}