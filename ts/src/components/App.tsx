/// <reference path="../../typings/index.d.ts" />
import * as React from "react"
import {MainMenuView} from "./views/MainMenuView"
import {BoardView} from "./views/BoardView"
import {BoardModel} from "./models/BoardModel"
import {EntityModel} from "./models/EntityModel"
import {PlayerModel, Player} from "./models/PlayerModel"
import {BoardManager} from "./managers/BoardManager"
import {Tile} from "./models/TileModel"
import {CreatePlayerModalView} from "./views/CreatePlayerView"
import {EventHistory, EventType, GameState} from "./models/GameModel"
import {EventBus, AddPlayerEvent, PlayerAddedEvent, CreateGameButtonClickedEvent, GameStartedEvent, TileAddedEvent, InitEvent} from "./managers/GameManager"

export class App extends React.Component<{
    }, {
        gameState: GameState,
        currentView: any,
        modalViews: any[]
    }> {

    tileHeight = 300
    tileWidth = Math.ceil(Math.cos(Math.PI/6) * this.tileHeight)
    tileSpacing = 0

    constructor(props: any) {
        super(props)
        this.state = {
            gameState: new GameState(),
            currentView: BoardView,
            modalViews: []
        }
    }

    componentDidMount() {
        EventBus.subscribe(this.handleCreateGameButtonClickedEvent, CreateGameButtonClickedEvent.prototype)
        EventBus.subscribe(this.handlePlayerAddedEvent, PlayerAddedEvent.prototype)
        EventBus.subscribe(this.handleStartGameEvent, GameStartedEvent.prototype)
        EventBus.subscribe(this.handleTileAddedEvent, TileAddedEvent.prototype)
        EventBus.subscribe(this.handleInitEvent, InitEvent.prototype)

        /* DELETEME */
        EventBus.event(new InitEvent())
        EventBus.event(new AddPlayerEvent(new Player("#000", "p1")))
    }

/* =================================================================================================================================== */
/* ======================== Event Bus Subscriptions ================================================================================== */
/* =================================================================================================================================== */

    handleInitEvent = (event: InitEvent) => {
        if(!(event instanceof InitEvent)) {
            return
        }
        this.state.gameState = event.gameState
        this.setState(this.state)
    }

    handleCreateGameButtonClickedEvent = (event: CreateGameButtonClickedEvent) => {
        if(!(event instanceof CreateGameButtonClickedEvent)) {
            return
        }
        this.state.modalViews.push({view: CreatePlayerModalView, open: true})
        this.setState(this.state)
    }

    handlePlayerAddedEvent = (event: PlayerAddedEvent) => {
        if(!(event instanceof PlayerAddedEvent)) {
            return
        }
        this.state.gameState.playerModel = event.newPlayerModel
    }

    handleStartGameEvent = (event: GameStartedEvent) => {
        if(!(event instanceof GameStartedEvent)) {
            return
        }
        this.state.modalViews.map((modals, index) => {
            if(modals.view == CreatePlayerModalView) {
                this.state.modalViews.splice(index, 1)
            }
        })
        this.state.currentView = BoardView
        this.setState(this.state)
    }

    handleTileAddedEvent = (event: TileAddedEvent) => {
        if(!(event instanceof TileAddedEvent)) {
            return
        }
        this.state.gameState.boardModel = event.boardModel
        this.setState(this.state)
    }
/* =================================================================================================================================== */

    render() {
        if(!this.state.gameState.boardModel) {
            return null
        }
        var view: any
        switch(this.state.currentView) {
            case BoardView:
                view = (
                    <BoardView
                        tileHeight={this.tileHeight}
                        tileWidth={this.tileWidth}
                        tileSpacing={this.tileSpacing}
                        tiles={this.state.gameState.boardModel.tiles}
                        unexplored={this.state.gameState.boardModel.unexplored}/>
                )
                break;
            default: break;
            case MainMenuView:
                view = (
                    <MainMenuView
                        playerModel={this.state.gameState.playerModel}/>
                )
        }
        var modalViews: any
        if(this.state.modalViews && this.state.modalViews.length > 0) {
            modalViews = []
            this.state.modalViews.map((modal, index) => {
                switch(modal.view) {
                    case CreatePlayerModalView: 
                        modalViews.push(
                            <CreatePlayerModalView
                                open={modal.open}
                                key={index}>
                            </CreatePlayerModalView>
                        )
                        break;
                    default: break;
                }
            })
        }
        return  (
            <div id="app-container">
                {modalViews}
                <div id="view-container">
                    {view}
                </div>
            </div>
        )
    }
}