import {EntityAspect} from "../managers/EntityManager"

export class EntityModel {
    entities: {[playerId: number]: Entity[]}

    constructor(entities?: {[playerId: number]: Entity[]}) {
        this.entities = entities || {}
    }
}

export class Entity {
    ownerId: number
    skinUrl: string
    aspects: EntityAspect[]
    position: {x: string, y: string}

    constructor(ownerId: number, skinUrl: string, position: {x: string, y: string}, aspects?: EntityAspect[]) {
        this.ownerId = ownerId
        this.skinUrl = skinUrl
        this.aspects = aspects || []
        this.position = position
    }
}