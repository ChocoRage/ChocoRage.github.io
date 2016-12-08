import {EntityModel} from "../models/EntityModel"

export class EntityManager {
    static getNextEntityId(entityModel: EntityModel): number {
        var currentMaxId = 0
        Object.keys(entityModel.entities).map((playerId) => {
            entityModel.entities[+playerId].map(entity => {
                currentMaxId = Math.max(entity.id, currentMaxId)
            })
        })
        return currentMaxId + 1
    }
}

export interface EntityAspect {

}

export class MOVEABLE implements EntityAspect{}
export class ATTACKABLE implements EntityAspect{}
export class CLICKABLE implements EntityAspect{}
export class HARVESTABLE implements EntityAspect{}
export class TARGETABLE implements EntityAspect{}