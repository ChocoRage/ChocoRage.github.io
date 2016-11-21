import {EntityAspect} from "../managers/EntityManager"

export class EntityModel {
    entities: Entity[]

    constructor(entities?: Entity[]) {
        this.entities = entities || []
    }
}

export class Entity {
    ownerId: number
    skinUrl: string
    aspects: EntityAspect[]

    constructor(ownerId: number, skinUrl: string, aspects?: EntityAspect[]) {
        this.ownerId = ownerId
        this.skinUrl = skinUrl
        this.aspects = aspects || []
    }
}