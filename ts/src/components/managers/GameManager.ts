import {App} from "../App"

import {Tile} from "../models/TileModel"
import {BoardModel} from "../models/BoardModel"
import {Player, PlayerModel} from "../models/PlayerModel"
import {BoardManager} from "./BoardManager"
import {PlayerManager} from "./PlayerManager"
import {ResourceType, PlayerResource, ResourceModel} from "../models/ResourceModel"
import {EventType, GameState} from "../models/GameModel"

import {cloneObject} from "../util/Utils"

import * as DB from "../database/Database"

class GameManager {
    private static gameState: GameState

    static handleEvent(event: EventType): void {
        console.log((event as any).constructor.name)
        this["handle" + (event as any).constructor.name](event)
    }

    static handleInitEvent() {
        GameManager.gameState = new GameState()

        GameManager.gameState.boardModel = new BoardModel()
        GameManager.gameState.playerModel = new PlayerModel()
        GameManager.gameState.resourceModel = new ResourceModel()

        var initEvent = new InitEvent(GameManager.gameState)

        EventBusNotifyer.notify(initEvent)
    }

    static startGame() {
        var gameStartedEvent = new GameStartedEvent()
        EventBusNotifyer.notify(gameStartedEvent)
    }

    static handleAddPlayerEvent(event: AddPlayerEvent) {
        var nextPlayerId = PlayerManager.getNextPlayerId(GameManager.gameState.playerModel)
        event.newPlayer.id = nextPlayerId
        GameManager.gameState.playerModel.players[nextPlayerId] = event.newPlayer
        var playerCopy = (cloneObject(event.newPlayer) as Player)
        var playerModelCopy = (cloneObject(GameManager.gameState.playerModel) as PlayerModel)
        var playerAddedEvent = new PlayerAddedEvent(playerCopy, playerModelCopy)
        EventBusNotifyer.notify(playerAddedEvent)
    }

    static createGameButtonClicked(event: CreateGameButtonClickedEvent) {
        EventBusNotifyer.notify(event)
    }

    static addTile(event: AddTileEvent) {
        var newTile = new Tile(event.target.x, event.target.y, DB.grass)
        var boundsBefore = BoardManager.getBounds(GameManager.gameState.boardModel.unexplored)
        var newBoard = BoardExecutor.addTile(GameManager.gameState.boardModel, newTile)
        var tileAddedEvent = new TileAddedEvent(event.triggeringPlayerId, newTile, newBoard, boundsBefore)
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
    gameState: GameState

    constructor(gameState?: GameState) {
        super()
        this.gameState = gameState
    }
}

export class AddTileEvent extends EventType {
    target: Tile

    constructor(target?: Tile) {
        super()
        this.target = target
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

    constructor(triggeringPlayerId: number, target?: Tile, boardModel?: BoardModel, boundsBefore?: {widthMin: number,widthMax: number,heightMin: number,heightMax: number}) {
        super()
        this.target = target
        this.boardModel = boardModel
        this.boundsBefore = boundsBefore
    }
}

export class CreateGameButtonClickedEvent extends EventType {
    isLogged = false
}

export class GameStartedEvent extends EventType {

    constructor() {
        super()
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
/* Executors have methods that affect the game, such as the board, the entities or anything else that can be mutated.
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
