export class GameModel {
    listeners: ((gameAction: string, targets: any)=>{})[]

    constructor() {
        this.listeners = []
    }
}