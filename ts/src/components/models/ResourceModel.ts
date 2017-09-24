export class PlayerResource {
    amount: number = 0
    cap: number = -1

    constructor(amount: number, cap?: number) {
        this.amount = +amount
        if(cap) this.cap = cap
    }
}

export class ResourceType {
    name: string
    icon: string
    
    constructor(name: string, icon: string) {
        this.name = name
        this.icon = icon
    }
}