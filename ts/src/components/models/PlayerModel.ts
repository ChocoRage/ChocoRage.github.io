import {App} from "../App"

export class PlayerModel {
    players: {[playerId: number]: Player}

    constructor(players?: {[playerId: number]: Player}) {
        this.players = players || {}
    }
}

export class Player {
    id: number
    color: string
    name: string

    constructor(id: number, color: string, name: string) {
        this.id = id
        this.color = color
        this.name = name
    }
}