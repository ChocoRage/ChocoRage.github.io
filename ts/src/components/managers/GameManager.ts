import {Entity} from "../models/EntityModel"
import {App} from "../App"
import {TileModel} from "../models/TileModel"

export class GameManager {
    createPlayerHero(ownerId: number, skinUrl: string, aspects: string[]) {
        return new Entity(ownerId, skinUrl, aspects)
    }
}

export class EventBus {
    static notify(eventType: EventType) {
        App.gameModel.listeners.map(cb => {
            cb(eventType)
        })
    }

    static subscribe(cb: (eventType: EventType)=>void) {
        App.gameModel.listeners.push(cb)
    }

    static unsubscribe(cb: (eventType: EventType)=>void) {
        var idx = App.gameModel.listeners.indexOf(cb)
        App.gameModel.listeners.splice(idx, 1)
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

export class BoardTileClickEvent implements EventType {
    target: TileModel

    constructor(target?: TileModel) {
        this.target = target
    }
}

export class AdjacentTileClickEvent implements EventType {
    target: TileModel

    constructor(target?: TileModel) {
        this.target = target
    }
}

export class TileAddedEvent implements EventType {
    target: TileModel
    boundsBefore: {
        widthMin: number,
        widthMax: number,
        heightMin: number,
        heightMax: number
    }
}