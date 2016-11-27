import {EventType} from "../managers/GameManager"

export class EventHistory {
    events: EventType[]

    constructor(events?: EventType[]) {
        this.events = events || []
    }
}