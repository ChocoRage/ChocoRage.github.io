/// <reference path="../../typings/index.d.ts" />
import * as React from "react"
import {MainMenuView} from "./views/MainMenuView"
import {BoardView} from "./views/BoardView"
import {BoardModel} from "./models/BoardModel"
import {EntityModel} from "./models/EntityModel"
import {PlayerModel} from "./models/PlayerModel"
import {BoardManager} from "./managers/BoardManager"
import {TileModel} from "./models/TileModel"
import {CreateGameModalView} from "./views/CreateGameView"
import {EventHistory} from "./models/GameModel"
import * as GM from "./managers/GameManager"

export class App extends React.Component<{
    }, {
        currentView: any,
        modalViews: any[],
        boardModel: BoardModel,
        entityModel: EntityModel,
        playerModel: PlayerModel,
        activePlayerId: number,
        eventHistory: EventHistory
    }> {

    tileHeight = 300
    tileWidth = Math.ceil(Math.cos(Math.PI/6) * this.tileHeight)
    tileSpacing = 0

    constructor(props: any) {
        super(props)
        this.state = {
            currentView: BoardView,
            modalViews: [],
            boardModel: null,
            entityModel: new EntityModel(),
            playerModel: new PlayerModel(),
            activePlayerId: null,
            eventHistory: new EventHistory()
        }
    }

    componentDidMount() {
        GM.EventBus.subscribe(this.addToEventHistory)
        GM.EventBus.subscribe(this.handleCreateGameButtonClickedEvent)
        GM.EventBus.subscribe(this.handlePlayerCreatedEvent)
        GM.EventBus.subscribe(this.handleEntityCreatedEvent)
        GM.EventBus.subscribe(this.handleStartGameEvent)
        GM.EventBus.subscribe(this.handleTileAddedEvent)
        GM.EventBus.subscribe(this.handleEndTurnEvent)
    }

    /* ========================================================================= */
    /* ======================== Event Bus Subscriptions ======================== */
    /* ========================================================================= */
    addToEventHistory = (event: GM.EventType) => {
        // TODO if events are loaded by savegame, don't register them again
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

    handlePlayerCreatedEvent = (event: GM.PlayerCreatedEvent) => {
        if(!(event instanceof GM.PlayerCreatedEvent)) {
            return
        }
        this.state.playerModel.players.push(event.newPlayer)
        this.state.entityModel.entities[event.newPlayer.id] = []
    }

    handleEntityCreatedEvent = (event: GM.EntityCreatedEvent) => {
        if(!(event instanceof GM.EntityCreatedEvent)) {
            return
        }
        this.state.entityModel.entities[event.newEntity.playerId].push(event.newEntity)
    }

    handleStartGameEvent = (event: GM.StartGameEvent) => {
        if(!(event instanceof GM.StartGameEvent)) {
            return
        }
        this.state.modalViews.map((modals, index) => {
            if(modals.view == CreateGameModalView) {
                this.state.modalViews.splice(index, 1)
            }
        })
        this.state.boardModel = new BoardModel()
        this.state.currentView = BoardView
        this.setState(this.state)
    }

    handleTileAddedEvent = (event: GM.TileAddedEvent) => {
        if(!(event instanceof GM.TileAddedEvent)) {
            return
        }
        this.state.boardModel = event.boardModel
    }

    handleEndTurnEvent = (event: GM.EndTurnEvent) => {
        if(!(event instanceof GM.EndTurnEvent)) {
            return
        }
        var currentPlayerIndex: number
        for(var i = 0; i < this.state.playerModel.players.length; i++) {
            if(this.state.activePlayerId == this.state.playerModel.players[i].id) {
                currentPlayerIndex = i
                break
            }
        }
        this.state.activePlayerId = (currentPlayerIndex + 1) % this.state.playerModel.players.length
    }

    render() {
        var view: any       
        
        /* ============= quick start ============== */        
        var color = "ff8800"
        var name = "player1"
        var createStartGameButtonClickEvent = new GM.StartGameButtonClickedEvent(this.state.playerModel, this.state.entityModel, [{name: name, color: color}])
        GM.GameManager.startGameButtonClicked(createStartGameButtonClickEvent)

        switch(this.state.currentView) {
            case BoardView:
                view = (
                    <BoardView
                        boardModel={this.state.boardModel}
                        entityModel={this.state.entityModel}
                        playerModel={this.state.playerModel}
                        tileHeight={this.tileHeight}
                        tileWidth={this.tileWidth}
                        tileSpacing={this.tileSpacing}
                        activePlayerId={this.state.activePlayerId}/>
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
                                playerModel={this.state.playerModel}
                                entityModel={this.state.entityModel}
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