import {App} from "../App"
import {PlayerResource, ResourceType} from "./ResourceModel"

export class PlayerModel {
    players: Player[]

    constructor(players?: Player[]) {
        this.players = players || []
    }
}

export class Player {
    id: number
    color: string
    name: string
    playerResources: {[id: number]: PlayerResource}

    constructor(color: string, name: string) {
        this.color = color
        this.name = name
    }
}