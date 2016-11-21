import {Entity} from "../models/EntityModel.ts"
import {App} from "../App"

export class GameManager {
    createPlayerHero(ownerId: number, skinUrl: string, aspects: string[]) {
        return new Entity(ownerId, skinUrl, aspects)
    }
}

export class EventBus {
    static notify(gameAction: string, targets: {}[]) {
        App.gameModel.listeners.map((cb, index) => {
            cb(gameAction, targets)
        })
    }

    static subscribe(cb: (gameAction: string, targets: {}[])=>{}) {
        App.gameModel.listeners.push(cb)
    }

    static unsubscribe(cb: (gameAction: string, targets: {}[])=>{}) {
        var idx = App.gameModel.listeners.indexOf(cb)
        App.gameModel.listeners.splice(idx, 1)
    }
}

export interface Event {
    name: string
    targets?: {}[]
}

export class AttackedEvent implements Event{
    name: "attacked"
}

export class AttackingEvent implements Event{
    name: "attacking"
}

export class DamageDealtEvent implements Event{
    name: "damage_dealt"
}

export class DamageTakenEvent implements Event{
    name: "damage_taken"
}

export class HealedEvent implements Event{
    name: "healed"
}

export class HealingEvent implements Event{
    name: "healing"
}

export class MovingEvent implements Event{
    name: "moving"
}

export class TargetedEvent implements Event{
    name: "targeted"
}

export class TargetingEvent implements Event{
    name: "targeting"
}
