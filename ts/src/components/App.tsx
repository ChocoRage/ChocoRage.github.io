/// <reference path="../../typings/index.d.ts" />
import * as React from "react"
import {MainMenuView} from "./views/MainMenuView"
import {BoardView} from "./views/BoardView"
import {Player} from "./models/PlayerModel"
import {TileType} from "./models/TileModel"
import {CreatePlayerModalView} from "./views/CreatePlayerView"
import {GameStateModel, GameState} from "./models/GameModel"
import {ResourceType} from "./models/ResourceModel"
import {EventBus, AddPlayerEvent, PlayerAddedEvent, CreateGameButtonClickedEvent, StartGameEvent, TileAddedEvent, InitEvent} from "./managers/GameManager"

export class App extends React.Component<{
    }, {
        gameStateModel: GameStateModel,
        currentView: any,
        modalViews: any[],
        tileTypes: TileType[],
        resourceTypes: ResourceType[]
    }> {

    tileHeight = 300
    tileWidth = Math.ceil(Math.cos(Math.PI/6) * this.tileHeight)
    tileSpacing = 0

    constructor(props: any) {
        super(props)
        this.state = {
            gameStateModel: new GameStateModel(),
            currentView: BoardView,
            modalViews: [],
            tileTypes: null,
            resourceTypes: null
        }
    }

    componentDidMount() {
        EventBus.subscribe(this.handleCreateGameButtonClickedEvent, CreateGameButtonClickedEvent.prototype)
        EventBus.subscribe(this.handlePlayerAddedEvent, PlayerAddedEvent.prototype)
        EventBus.subscribe(this.handleStartGameEvent, StartGameEvent.prototype)
        EventBus.subscribe(this.handleTileAddedEvent, TileAddedEvent.prototype)
        EventBus.subscribe(this.handleInitEvent, InitEvent.prototype)

        /* DELETEME */
        EventBus.event(new InitEvent(null, null, null))
        EventBus.event(new AddPlayerEvent(new Player("#000", "p1")))
        EventBus.event(new StartGameEvent(null))
    }

/* =================================================================================================================================== */
/* ======================== Event Bus Subscriptions ================================================================================== */
/* =================================================================================================================================== */

    handleInitEvent = (event: InitEvent) => {
        if(!(event instanceof InitEvent)) {
            return
        }
        this.state.gameStateModel = event.gameState
        this.state.tileTypes = event.tileTypes
        this.state.resourceTypes = event.resourceTypes
        this.setState(this.state)
    }

    handleCreateGameButtonClickedEvent = (event: CreateGameButtonClickedEvent) => {
        if(!(event instanceof CreateGameButtonClickedEvent)) {
            return
        }
        if(this.state.gameStateModel.gameState == GameState.GamePaused) {
            return
        }
        this.state.modalViews.push({view: CreatePlayerModalView, open: true})
        this.setState(this.state)
    }

    handlePlayerAddedEvent = (event: PlayerAddedEvent) => {
        if(!(event instanceof PlayerAddedEvent)) {
            return
        }
        this.state.gameStateModel.playerModel = event.newPlayerModel
    }

    handleStartGameEvent = (event: StartGameEvent) => {
        if(!(event instanceof StartGameEvent)) {
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
        this.state.gameStateModel.boardModel = event.boardModel
        this.setState(this.state)
    }
/* =================================================================================================================================== */

    render() {
        if(!this.state.gameStateModel.boardModel) {
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
                        tiles={this.state.gameStateModel.boardModel.tiles}
                        unexplored={this.state.gameStateModel.boardModel.unexplored}
                        tileTypes={this.state.tileTypes}
                        resourceTypes={this.state.resourceTypes}
                        gameStateModel={this.state.gameStateModel}/>
                )
                break;
            default: break;
            case MainMenuView:
                view = (
                    <MainMenuView
                        playerModel={this.state.gameStateModel.playerModel}/>
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