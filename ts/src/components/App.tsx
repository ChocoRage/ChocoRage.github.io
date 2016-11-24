/// <reference path="../../typings/index.d.ts" />
import * as React from "react"
import {MainMenuView} from "./views/MainMenuView"
import {BoardView} from "./views/BoardView"
import {BoardModel} from "./models/BoardModel"
import {EntityModel} from "./models/EntityModel"
import {PlayerModel} from "./models/PlayerModel"
import {BoardManager} from "./managers/BoardManager"
import {TileModel} from "./models/TileModel"
import * as GM from "./managers/GameManager"

export class App extends React.Component<{
    }, {
        currentView: any,
        boardModel: BoardModel,
        entityModel: EntityModel
    }> {

    tileHeight = 300
    tileWidth = Math.ceil(Math.cos(Math.PI/6) * this.tileHeight)
    tileSpacing = 0

    constructor(props: any) {
        super(props)
        this.state = {
            currentView: BoardView,
            boardModel: new BoardModel(),
            entityModel: new EntityModel()
        }
    }

    componentDidMount() {
        GM.EventBus.subscribe(this.startGameButtonClicked)
        GM.EventBus.subscribe(this.tileAdded)
    }

    startGameButtonClicked = (event: GM.StartGameButtonClickedEvent) => {
        if(!(event instanceof GM.StartGameButtonClickedEvent)) {
            return
        }
        this.state.entityModel.entities
    }

    tileAdded = (event: GM.TileAddedEvent) => {
        if(!(event instanceof GM.TileAddedEvent)) {
            return
        }
        this.state.boardModel = event.boardModel
    }

    render() {
        var view: any
        if(this.state.currentView == BoardView) {
            view = (
                <BoardView
                    board={this.state.boardModel}
                    entities={this.state.entityModel.entities}
                    tileHeight={this.tileHeight}
                    tileWidth={this.tileWidth}
                    tileSpacing={this.tileSpacing}/>
            )
        }
        return  (
            <div id="app-container">
                <div id="view-container">
                    {view}
                </div>
            </div>
        )
    }
}