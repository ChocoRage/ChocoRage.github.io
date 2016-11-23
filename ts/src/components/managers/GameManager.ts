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
    name: string
    targets: any
}

export class AttackedEvent implements EventType {
    name: "attacked"
    targets: {}[] = []
}

export class AttackingEvent implements EventType {
    name: "attacking"
    targets: {}[] = []
}

export class DamageDealtEvent implements EventType {
    name: "damage_dealt"
    targets: {}[] = []
}

export class DamageTakenEvent implements EventType {
    name: "damage_taken"
    targets: {}[] = []
}

export class HealedEvent implements EventType {
    name: "healed"
    targets: {}[] = []
}

export class HealingEvent implements EventType {
    name: "healing"
    targets: {}[] = []
}

export class MovingEvent implements EventType {
    name: "moving"
    targets: {}[] = []
}

export class TargetedEvent implements EventType {
    name: "targeted"
    targets: {}[] = []
}

export class TargetingEvent implements EventType {
    name: "targeting"
    targets: {}[] = []
}

export class TileClickEvent implements EventType {
    name: "tile_clicked"
    targets: TileModel

    constructor(targets?: TileModel) {
        this.targets = targets
    }
}

export class TileAddedEvent implements EventType {
    name: "tile_added"
    targets: TileModel
    boundsBefore: {
        widthMin: number,
        widthMax: number,
        heightMin: number,
        heightMax: number
    }
}