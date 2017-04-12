import {BoardModel} from "./BoardModel"
import {PlayerModel} from "./PlayerModel"
import {ResourceModel} from "./ResourceModel"

export class EventHistory {
    events: EventType[]

    constructor(events?: EventType[]) {
        this.events = events || []
    }
}

export interface EventType {
    triggeringPlayerId?: number
    isLogged?: boolean
}

export class GameState {
    currentView: any
    modalViews: any[]
    boardModel: BoardModel
    playerModel: PlayerModel
    resourceModel: ResourceModel
    eventHistory: EventHistory
    playerId: number
}
