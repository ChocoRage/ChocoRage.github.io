/// <reference path="../../typings/index.d.ts" />
import * as React from "react"
import {MainMenuView} from "./views/MainMenuView"
import {BoardView} from "./views/BoardView"
import {BoardModel} from "./models/BoardModel"
import {EntityModel} from "./models/EntityModel"
import {PlayerModel, Player} from "./models/PlayerModel"
import {BoardManager} from "./managers/BoardManager"
import {Tile} from "./models/TileModel"
import {CreateGameModalView} from "./views/CreateGameView"
import {EventHistory, EventType, GameState} from "./models/GameModel"
import * as GM from "./managers/GameManager"

export class App extends React.Component<{
    }, GameState> {

    tileHeight = 300
    tileWidth = Math.ceil(Math.cos(Math.PI/6) * this.tileHeight)
    tileSpacing = 0

    constructor(props: any) {
        super(props)
        this.state = new GameState()
    }

    componentDidMount() {
        GM.EventBus.subscribe(this.addToEventHistory)
        GM.EventBus.subscribe(this.handleCreateGameButtonClickedEvent)
        GM.EventBus.subscribe(this.handlePlayerCreatedEvent)
        GM.EventBus.subscribe(this.handleStartGameEvent)
        GM.EventBus.subscribe(this.handleTileAddedEvent)

        /* DELETEME */
        GM.GameManager.init()
        GM.GameManager.addPlayer(new GM.AddPlayerEvent(new Player("#000", "p1")))
        GM.GameManager.startGame()
    }

/* =================================================================================================================================== */
/* ======================== Event Bus Subscriptions ================================================================================== */
/* =================================================================================================================================== */
    addToEventHistory = (event: EventType) => {
        // TODO if events are loaded from a savegame, don't register them again
        if(event.isLogged && typeof event.isLogged == "function" && event.isLogged()) {
            this.state.eventHistory.events.push(event)
        }
    }

    handleCreateGameButtonClickedEvent = (event: GM.CreateGameButtonClickedEvent) => {
        if(!(event instanceof GM.CreateGameButtonClickedEvent)) {
            return
        }
        this.state.modalViews.push({view: CreateGameModalView, open: true})
        this.setState(this.state)
    }

    handlePlayerCreatedEvent = (event: GM.PlayerAddedEvent) => {
        if(!(event instanceof GM.PlayerAddedEvent)) {
            return
        }
        this.state.playerModel = event.newPlayerModel
    }

    handleStartGameEvent = (event: GM.GameStartedEvent) => {
        if(!(event instanceof GM.GameStartedEvent)) {
            return
        }
        this.state.modalViews.map((modals, index) => {
            if(modals.view == CreateGameModalView) {
                this.state.modalViews.splice(index, 1)
            }
        })
        this.state.currentView = BoardView
        this.setState(this.state)
    }

    handleTileAddedEvent = (event: GM.TileAddedEvent) => {
        if(!(event instanceof GM.TileAddedEvent)) {
            return
        }
        this.state.boardModel = event.boardModel
        this.setState(this.state)
    }
/* =================================================================================================================================== */

    render() {
        var view: any
        switch(this.state.currentView) {
            case BoardView:
                view = (
                    <BoardView
                        tileHeight={this.tileHeight}
                        tileWidth={this.tileWidth}
                        tileSpacing={this.tileSpacing}
                        tiles={this.state.boardModel.tiles}
                        unexplored={this.state.boardModel.unexplored}/>
                )
                break;
            default: break;
            case MainMenuView:
                view = (
                    <MainMenuView
                        playerModel={this.state.playerModel}/>
                )
        }
        var modalViews: any
        if(this.state.modalViews && this.state.modalViews.length > 0) {
            modalViews = []
            this.state.modalViews.map((modal, index) => {
                switch(modal.view) {
                    case CreateGameModalView: 
                        modalViews.push(
                            <CreateGameModalView
                                open={modal.open}
                                key={index}>
                            </CreateGameModalView>
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