import {BoardModel} from "./BoardModel"
import {PlayerModel} from "./PlayerModel"
import {ResourceModel} from "./ResourceModel"

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

export class GameState {
    boardModel: BoardModel
    playerModel: PlayerModel
    resourceModel: ResourceModel
    eventHistory: EventHistory
}
