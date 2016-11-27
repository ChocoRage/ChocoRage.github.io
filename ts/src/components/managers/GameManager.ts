import {Entity} from "../models/EntityModel"
import {App} from "../App"
import {TileModel} from "../models/TileModel"
import {BoardModel} from "../models/BoardModel"
import {BoardManager} from "./BoardManager"
import {grass} from "./TileManager"
import {Player, PlayerModel} from "../models/PlayerModel"
import {PlayerManager} from "./PlayerManager"

export class GameManager {
    static unexploredTileClicked(event: UnexploredTileClickedEvent) {
        EventBusNotifyer.notify(event)
        var newTile = new TileModel(event.target.x, event.target.y, grass)
        var boundsBefore = BoardManager.getBounds(event.boardModel.unexplored)
        var newBoard = BoardExecutor.addTile(event.boardModel, newTile)
        var tileAddedEvent = new TileAddedEvent(event.triggeringPlayerId, newTile, newBoard, boundsBefore)
        EventBusNotifyer.notify(tileAddedEvent)
    }

    static exploredTileClicked(event: ExploredTileClickedEvent) {
        EventBusNotifyer.notify(event)
    }

    static createGameButtonClicked(event: CreateGameButtonClickedEvent) {
        EventBusNotifyer.notify(event)
    }

    static startGame(event: StartGameEvent) {
        // TODO if game already started, return
        EventBusNotifyer.notify(event)
    }

    static createGameFormSubmitted(event: CreateGameFormSubmitted) {
        // TODO check if player already exists
        EventBusNotifyer.notify(event)
        var nextId = PlayerManager.getNextPlayerId(event.playerModel)
        event.playerProperties.map(player => {
            var newPlayer = new Player(nextId, player.name, player.color)
            var playerCreatedEvent = new PlayerCreatedEvent(newPlayer)
            EventBusNotifyer.notify(playerCreatedEvent)
            nextId += 1
        })
        var startGameEvent = new StartGameEvent()
        EventBusNotifyer.notify(startGameEvent)
    }

    static endTurnButtonClicked(event: EndTurnButtonClickedEvent) {
        EventBusNotifyer.notify(event)
        var endTurnEvent = new EndTurnEvent(event.triggeringPlayerId)
        EventBusNotifyer.notify(endTurnEvent)
    }
}

class EventBusNotifyer {
    // the listeners can be part property of a manager component because they will never be persisted.
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

export interface EventType {
    triggeringPlayerId?: number
    isLogged?: ()=>boolean
}

export class AttackedEvent implements EventType {
    triggeringPlayerId: number
}

export class AttackingEvent implements EventType {
    triggeringPlayerId: number
}

export class DamageDealtEvent implements EventType {
    triggeringPlayerId: number
}

export class DamageTakenEvent implements EventType {
    triggeringPlayerId: number
}

export class HealedEvent implements EventType {
    triggeringPlayerId: number
}

export class HealingEvent implements EventType {
    triggeringPlayerId: number
}

export class MovingEvent implements EventType {
    triggeringPlayerId: number
}

export class TargetedEvent implements EventType {
    triggeringPlayerId: number
}

export class TargetingEvent implements EventType {
    triggeringPlayerId: number
}

export class UnexploredTileClickedEvent implements EventType {
    triggeringPlayerId: number
    target: TileModel
    boardModel: BoardModel

    constructor(triggeringPlayerId: number, target?: TileModel, boardModel?: BoardModel) {
        this.target = target
        this.boardModel = boardModel
    }
}

export class ExploredTileClickedEvent implements EventType {
    triggeringPlayerId: number
    target: TileModel
    boardModel: BoardModel

    constructor(triggeringPlayerId: number, target?: TileModel, boardModel?: BoardModel) {
        this.target = target
        this.boardModel = boardModel
    }
}

export class TileAddedEvent implements EventType {
    triggeringPlayerId: number
    target: TileModel
    boardModel: BoardModel
    boundsBefore: {
        widthMin: number,
        widthMax: number,
        heightMin: number,
        heightMax: number
    }

    constructor(triggeringPlayerId: number, target?: TileModel, boardModel?: BoardModel, boundsBefore?: {widthMin: number,widthMax: number,heightMin: number,heightMax: number}) {
        this.target = target
        this.boardModel = boardModel
        this.boundsBefore = boundsBefore
    }
}

export class CreateGameButtonClickedEvent implements EventType {
    isLogged = ()=>{return false}
}

export class StartGameButtonClicked implements EventType {
    isLogged = ()=>{return false}
}

export class StartGameEvent implements EventType {
}

export class CreateGameFormSubmitted implements EventType {
    isLogged = ()=>{return false}
    playerModel: PlayerModel
    playerProperties: {name: string, color: string}[]

    constructor(playerModel: PlayerModel, playerProperties: {name: string, color: string}[]) {
        this.playerModel = playerModel
        this.playerProperties = playerProperties
    }
}

export class PlayerCreatedEvent implements EventType {
    newPlayer: Player

    constructor(newPlayer: Player) {
        this.newPlayer = newPlayer
    }
}


export class EndTurnButtonClickedEvent implements EventType {
    triggeringPlayerId: number

    constructor(triggeringPlayerId: number) {
        this.triggeringPlayerId = triggeringPlayerId
    }
}

export class EndTurnEvent implements EventType {
    triggeringPlayerId: number

    constructor(triggeringPlayerId: number) {
        this.triggeringPlayerId = triggeringPlayerId
    }
}


/* ================= Executors =================*/
/* Executors have methods that affect the game, such as the board, the entities or anything else that can be mutated.
Executors are only visible to the Game Manager to make sure no component other than the Game Manager can call these functions. */
class BoardExecutor {
    static addTile(boardModel: BoardModel, tile: TileModel): BoardModel {
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

    private static mergeBoards(board1: {[x: string]: {[y: string]: TileModel}}, board2: {[x: string]: {[y: string]: TileModel}}) : {[x: string]: {[y: string]: TileModel}} {
        var result: {[x: string]: {[y: string]: TileModel}} = {}
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
