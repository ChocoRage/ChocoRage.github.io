import {BoardModel} from "./BoardModel"
import {PlayerModel, Player} from "./PlayerModel"

export class EventHistory {
    events: EventType[]

    constructor(events?: EventType[]) {
        this.events = events || []
    }
}

export abstract class EventType {
    triggeringPlayerId?: number
    isLogged?: boolean = true
}

export class GameStateModel {
    boardModel: BoardModel
    playerModel: PlayerModel
    eventHistory: EventHistory
    currentPlayer: Player
    gameState: GameState
}

export enum GameState {
    GamePaused,
    GameRunning
}