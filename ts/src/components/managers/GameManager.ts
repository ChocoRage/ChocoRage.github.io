import {Entity} from "../models/EntityModel"
import {App} from "../App"
import {TileModel} from "../models/TileModel"
import {BoardModel} from "../models/BoardModel"
import {BoardManager} from "./BoardManager"
import {grass} from "./TileManager"

export class GameManager {
    static unexploredTileClicked(event: UnexploredTileClickedEvent) {
        EventBusNotifyer.notify(event)
        var newTile = new TileModel(event.target.x, event.target.y, grass)
        var boundsBefore = BoardManager.getBounds(event.boardModel.unexplored)
        var newBoard = BoardExecutor.addTile(event.boardModel, newTile)
        var tileAddedEvent = new TileAddedEvent(newTile, newBoard, boundsBefore)
        EventBusNotifyer.notify(tileAddedEvent)
    }

    static exploredTileClicked(event: ExploredTileClickedEvent) {
        EventBusNotifyer.notify(event)
    }

    static startGameButtonClicked(event: StartGameButtonClickedEvent) {
        EventBusNotifyer.notify(event)        
    }
}

class EventBusNotifyer {    
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
}

export class AttackedEvent implements EventType {
}

export class AttackingEvent implements EventType {
}

export class DamageDealtEvent implements EventType {
}

export class DamageTakenEvent implements EventType {
}

export class HealedEvent implements EventType {
}

export class HealingEvent implements EventType {
}

export class MovingEvent implements EventType {
}

export class TargetedEvent implements EventType {
}

export class TargetingEvent implements EventType {
}

export class UnexploredTileClickedEvent implements EventType {
    target: TileModel
    boardModel: BoardModel

    constructor(target?: TileModel, boardModel?: BoardModel) {
        this.target = target
        this.boardModel = boardModel
    }
}

export class ExploredTileClickedEvent implements EventType {
    target: TileModel
    boardModel: BoardModel

    constructor(target?: TileModel, boardModel?: BoardModel) {
        this.target = target
        this.boardModel = boardModel
    }
}

export class TileAddedEvent implements EventType {
    target: TileModel
    boardModel: BoardModel
    boundsBefore: {
        widthMin: number,
        widthMax: number,
        heightMin: number,
        heightMax: number
    }

    constructor(target?: TileModel, boardModel?: BoardModel, boundsBefore?: {widthMin: number,widthMax: number,heightMin: number,heightMax: number}) {
        this.target = target
        this.boardModel = boardModel
        this.boundsBefore = boundsBefore
    }
}

export class StartGameButtonClickedEvent implements EventType {

}

export class StartGameEvent implements EventType {

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
