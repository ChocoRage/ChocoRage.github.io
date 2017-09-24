import {App} from "../App"

import {Tile, TileType} from "../models/TileModel"
import {BoardModel} from "../models/BoardModel"
import {Player, PlayerModel} from "../models/PlayerModel"
import {ResourceType, PlayerResource} from "../models/ResourceModel"
import {EventType, GameStateModel, GameState} from "../models/GameModel"
import {BoardManager} from "./BoardManager"
import {PlayerManager} from "./PlayerManager"
import {ResourceManager} from "./ResourceManager"

import {cloneObject} from "../util/Utils"

import {tileTypes, resourceTypes} from "../database/Database"

class GameManager {
    private static gameStateModel: GameStateModel

    static handleEvent(event: EventType): void {
        console.log((event as any).constructor.name)
        this["handle" + (event as any).constructor.name](event)
    }

    static handleInitEvent() {
        GameManager.gameStateModel = new GameStateModel()
        GameManager.gameStateModel.boardModel = new BoardModel()
        GameManager.gameStateModel.playerModel = new PlayerModel()
        GameManager.gameStateModel.gameState = GameState.GamePaused

        var initEvent = new InitEvent(GameManager.gameStateModel, tileTypes, resourceTypes)

        EventBusNotifyer.notify(initEvent)
    }

    static handleStartGameEvent() {
        GameManager.gameStateModel.gameState = GameState.GameRunning
        GameManager.gameStateModel.currentPlayer = GameManager.gameStateModel.playerModel.players[0]

        var gameStartedEvent = new StartGameEvent(GameManager.gameStateModel)

        EventBusNotifyer.notify(gameStartedEvent)
    }

    static handleAddPlayerEvent(event: AddPlayerEvent) {
        var nextPlayerId = PlayerManager.getNextPlayerId(GameManager.gameStateModel.playerModel)
        event.newPlayer.id = nextPlayerId
        event.newPlayer.playerResources = ResourceManager.getInitialPlayerResources()
        GameManager.gameStateModel.playerModel.players[nextPlayerId] = event.newPlayer
        var playerCopy = (cloneObject(event.newPlayer) as Player)
        var playerModelCopy = (cloneObject(GameManager.gameStateModel.playerModel) as PlayerModel)

        var playerAddedEvent = new PlayerAddedEvent(playerCopy, playerModelCopy)

        EventBusNotifyer.notify(playerAddedEvent)
    }

    static createGameButtonClicked(event: CreateGameButtonClickedEvent) {
        EventBusNotifyer.notify(event)
    }

    static handleAddTileEvent(event: AddTileEvent) {
        // DELETEME
        var newTile = new Tile(event.tile.x, event.tile.y, event.tile.type)

        var boundsBefore = BoardManager.getBounds(GameManager.gameStateModel.boardModel.unexplored)
        var newBoard = BoardExecutor.addTile(GameManager.gameStateModel.boardModel, newTile)
        var boundsAfter = BoardManager.getBounds(newBoard.unexplored)

        var tileAddedEvent = new TileAddedEvent(event.triggeringPlayerId, newTile, newBoard, boundsBefore, boundsAfter)
        
        EventBusNotifyer.notify(tileAddedEvent)
    }
}

/* =================================================================================================================================== */
/* ======================== Event Bus ================================================================================================ */
/* =================================================================================================================================== */

class EventBusNotifyer {
    // the listeners can be property of a manager component because they will never be persisted.
    // every game has to populate the listeners at runtime. loaded games need to go through the event history and execute them serially.
    static listeners: ((eventType: EventType)=>void)[] = []

    static notify(eventType: EventType) {
        // TODO Make broadcasting more efficient. Create a channel for each event type and only notify listeners who are in that channel.
        EventBusNotifyer.listeners.map(cb => {
            cb(eventType)
        })
    }
}

export class EventBus {
    static subscribe(cb: (eventType: EventType)=>void, eventType: EventType) {
        EventBusNotifyer.listeners.push(cb)
    }

    static unsubscribe(cb: (eventType: EventType)=>void, eventType: EventType) {
        var idx = EventBusNotifyer.listeners.indexOf(cb)
        EventBusNotifyer.listeners.splice(idx, 1)
    }

    static event(event: EventType) {
        GameManager.handleEvent(event)
    }
}

/* =================================================================================================================================== */
/* ======================== Event Types ============================================================================================== */
/* =================================================================================================================================== */

export class InitEvent extends EventType {
    gameState: GameStateModel
    tileTypes: TileType[]
    resourceTypes: ResourceType[]

    constructor(gameState: GameStateModel, tileTypes: TileType[], resourceTypes: ResourceType[]) {
        super()
        this.gameState = gameState
        this.tileTypes = tileTypes
        this.resourceTypes = resourceTypes
    }
}

export class AddTileEvent extends EventType {
    tile: Tile

    constructor(target: Tile) {
        super()
        this.tile = target
    }
}

export class PlayerAddedEvent extends EventType {
    newPlayerModel: PlayerModel
    newPlayer: Player

    constructor(newPlayer: Player, newPlayerModel: PlayerModel) {
        super()
        this.newPlayer = newPlayer
        this.newPlayerModel = newPlayerModel
    }
}

export class TileAddedEvent extends EventType {
    triggeringPlayerId: number
    target: Tile
    boardModel: BoardModel
    boundsBefore: {
        widthMin: number,
        widthMax: number,
        heightMin: number,
        heightMax: number
    }
    boundsAfter: {
        widthMin: number,
        widthMax: number,
        heightMin: number,
        heightMax: number
    }

    constructor(
        triggeringPlayerId: number,
        target?: Tile,
        boardModel?: BoardModel,
        boundsBefore?: {
            widthMin: number,
            widthMax: number,
            heightMin: number,
            heightMax: number},
        boundsAfter?: {
            widthMin: number,
            widthMax: number,
            heightMin: number,
            heightMax: number}) {
        super()
        this.target = target
        this.boardModel = boardModel
        this.boundsBefore = boundsBefore
        this.boundsAfter = boundsAfter
    }
}

export class CreateGameButtonClickedEvent extends EventType {
    isLogged = false
}

export class StartGameEvent extends EventType {
    gameStateModel: GameStateModel

    constructor(gameStateModel: GameStateModel) {
        super()
        this.gameStateModel = gameStateModel
    }
}

export class AddPlayerEvent extends EventType {
    newPlayer: Player

    constructor(newPlayer: Player) {
        super()
        this.newPlayer = newPlayer
    }
}


/* =================================================================================================================================== */
/* ======================== Executors ================================================================================================ */
/* =================================================================================================================================== */
/* Executors have methods that affect the game, such as the board, or anything else that can be mutated.
Executors are only visible to the Game Manager to make sure no component other than the Game Manager can call these functions. */
class BoardExecutor {
    static addTile(boardModel: BoardModel, tile: Tile): BoardModel {
        if(boardModel.tiles[tile.x] && boardModel.tiles[tile.x][tile.y]) {
            console.error("Cannot create new tile: coordinates are taken")
        } else if(!boardModel.unexplored[tile.x] || !boardModel.unexplored[tile.x][tile.y]) {
            console.error("Cannot create new tile: coordinates are unreachable")
        }
        if(!boardModel.tiles[tile.x]) {
                boardModel.tiles[tile.x] = {}
        }

        delete boardModel.unexplored[tile.x][tile.y]
        if(Object.keys(boardModel.unexplored[tile.x]).length == 0) {
            delete boardModel.unexplored[tile.x]
        }

        // <REMOVE ME>
        boardModel.tiles[tile.x][tile.y] = tile
        // </REMOVE ME>

        boardModel.unexplored = this.mergeBoards(boardModel.unexplored, BoardManager.getUnexploredAdjacentTiles(boardModel.tiles, tile.x, tile.y))
        return boardModel
    }

    private static mergeBoards(board1: {[x: string]: {[y: string]: Tile}}, board2: {[x: string]: {[y: string]: Tile}}) : {[x: string]: {[y: string]: Tile}} {
        var result: {[x: string]: {[y: string]: Tile}} = {}
        Object.keys(board2).map(xIndex => {
            Object.keys(board2[+xIndex]).map(yIndex => {
                if(!result[xIndex]) {
                    result[xIndex] = {}
                }
                result[xIndex][yIndex] = board2[xIndex][yIndex] 
            })
        })
        Object.keys(board1).map(xIndex => {
            Object.keys(board1[+xIndex]).map(yIndex => {
                if(!result[xIndex]) {
                    result[xIndex] = {}
                }
                result[xIndex][yIndex] = board1[xIndex][yIndex] 
            })
        })
        return result
    }
}
