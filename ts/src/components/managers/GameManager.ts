import {App} from "../App"

import {Tile} from "../models/TileModel"
import {BoardModel} from "../models/BoardModel"
import {Player, PlayerModel} from "../models/PlayerModel"
import {BoardManager} from "./BoardManager"
import {PlayerManager} from "./PlayerManager"
import {ResourceType, PlayerResource, ResourceModel} from "../models/ResourceModel"
import {EventType, GameState} from "../models/GameModel"

import * as Utils from "../Utils"

import * as DB from "../database/Database"

export class GameManager {
    private static gameState: GameState

    static init(): GameState {
        GameManager.gameState = new GameState()

        GameManager.gameState.boardModel = new BoardModel()
        GameManager.gameState.playerModel = new PlayerModel()
        GameManager.gameState.resourceModel = new ResourceModel()

        return (Utils.cloneObject(GameManager.gameState) as GameState)
    }

    static startGame() {
        var gameStartedEvent = new GameStartedEvent()
        EventBusNotifyer.notify(gameStartedEvent)
    }

    static addPlayer(event: AddPlayerEvent) {
        var nextPlayerId = PlayerManager.getNextPlayerId(GameManager.gameState.playerModel)
        event.newPlayer.id = nextPlayerId
        GameManager.gameState.playerModel.players[nextPlayerId] = event.newPlayer
        var playerCopy = (Utils.cloneObject(event.newPlayer) as Player)
        var playerModelCopy = (Utils.cloneObject(GameManager.gameState.playerModel) as PlayerModel)
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
        var tileAddedEvent = new TileAddedEvent(GameManager.gameState.playerId, newTile, newBoard, boundsBefore)
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
        EventBusNotifyer.listeners.map(cb => {
            cb(eventType)
        })
    }
}

export class EventBus {
    static subscribe(cb: (eventType: EventType)=>void) {
        EventBusNotifyer.listeners.push(cb)
    }

    static unsubscribe(cb: (eventType: EventType)=>void) {
        var idx = EventBusNotifyer.listeners.indexOf(cb)
        EventBusNotifyer.listeners.splice(idx, 1)
    }
}

/* =================================================================================================================================== */
/* ======================== Event Types ============================================================================================== */
/* =================================================================================================================================== */

export class AddTileEvent implements EventType {
    target: Tile

    constructor(target?: Tile) {
        this.target = target
    }
}

export class PlayerAddedEvent implements EventType {
    newPlayerModel: PlayerModel
    newPlayer: Player

    constructor(newPlayer: Player, newPlayerModel: PlayerModel) {
        this.newPlayer = newPlayer
        this.newPlayerModel = newPlayerModel
    }
}

export class TileAddedEvent implements EventType {
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
        this.target = target
        this.boardModel = boardModel
        this.boundsBefore = boundsBefore
    }
}

export class CreateGameButtonClickedEvent implements EventType {
    isLogged = false
}

export class GameStartedEvent implements EventType {

    constructor() {
    }
}

export class AddPlayerEvent implements EventType {
    newPlayer: Player

    constructor(newPlayer: Player) {
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
