
export class Entity {
    aspects: EntityAspect[]

    constructor() {
        this.aspects = []
    }
}

export class EntityAspect {
    static MOVEABLE
    static ATTACKABLE
}