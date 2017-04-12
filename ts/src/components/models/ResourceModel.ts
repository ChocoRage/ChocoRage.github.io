import {res1} from "../managers/ResourceManager"

export class ResourceModel {
    resourceTypes: {[id: number]: ResourceType} = []

    constructor() {
        this.resourceTypes[0] = res1
    }
}

export class PlayerResource {
    resourceType: ResourceType
    amount: number
    cap: number

    constructor(resourceType: ResourceType, amount?: number, cap?: number) {
        this.resourceType = resourceType
        this.amount = amount || 0
        this.cap = cap || 99
    }
}

export class ResourceType {
    id: number
    name: string
    
    constructor(name: string) {
        this.name = name
    }
}