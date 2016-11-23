/// <reference path="../../typings/index.d.ts" />
import * as React from "react"
import {MainMenu} from "./views/MainMenu"
import {BoardView} from "./views/BoardView"
import {View} from "./models/ViewModel"
import {GameModel} from "./models/GameModel"
import {BoardModel} from "./models/BoardModel"
import {EntityModel} from "./models/EntityModel"
import {PlayerModel} from "./models/PlayerModel"
import {BoardManager} from "./managers/BoardManager"
import {TileModel} from "./models/TileModel"
import {GameManager, EventBus, EventType, BoardTileClickEvent, AdjacentTileClickEvent, TileAddedEvent} from "./managers/GameManager"

export class App extends React.Component<{
    }, {
        currentView: View,
        boardModel: BoardModel,
        entityModel: EntityModel,
        playerModel: PlayerModel
    }> {

    static gameModel: GameModel
    static playerModel: PlayerModel

    tileHeight = 300
    static cos30deg = Math.cos(Math.PI/6)
    tileWidth = Math.ceil(App.cos30deg * this.tileHeight)
    tileSpacing = 0

    constructor(props: any) {
        super(props)

        App.gameModel = new GameModel()

        this.state = {
            currentView: new View(BoardView),
            boardModel: new BoardModel(),
            entityModel: new EntityModel(),
            playerModel: App.playerModel
        }

        EventBus.subscribe(this.handleAdjacentTileClick)
    }

    handleAdjacentTileClick = (event: AdjacentTileClickEvent) => {
        if(!(event instanceof AdjacentTileClickEvent)) {
            return
        }
        var newTile = new TileModel(event.target.x, event.target.y, event.target.type)
        var tileAddedEvent = new TileAddedEvent()
        tileAddedEvent.target = newTile
        tileAddedEvent.boundsBefore = this.state.boardModel.getBounds()
        this.state.boardModel = BoardManager.addTile(this.state.boardModel, newTile)
        EventBus.notify(tileAddedEvent)
    }

    changeView(newView: View) {
        this.state.currentView = newView;
        this.setState(this.state)
    }

    render() {
        var View = this.state.currentView.view
        return  (
            <div id="app-container">
                <div id="view-container">
                    <View
                        changeView={this.changeView.bind(this)}
                        board={this.state.boardModel}
                        entities={this.state.entityModel.entities}
                        tileHeight={this.tileHeight}
                        tileWidth={this.tileWidth}
                        tileSpacing={this.tileSpacing}></View>
                </div>
            </div>
        )
    }
}