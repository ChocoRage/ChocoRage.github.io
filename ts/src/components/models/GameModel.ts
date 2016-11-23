import {EventType} from "../managers/GameManager"

export class GameModel {
    listeners: ((eventType: EventType)=>void)[]

    constructor() {
        this.listeners = []
    }
}