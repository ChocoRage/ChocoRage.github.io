export class EntityManager { 
}

export interface EntityAspect {
}

export class MOVEABLE implements EntityAspect{}
export class ATTACKABLE implements EntityAspect{}
export class CLICKABLE implements EntityAspect{}
export class HARVESTABLE implements EntityAspect{}
export class TARGETABLE implements EntityAspect{}