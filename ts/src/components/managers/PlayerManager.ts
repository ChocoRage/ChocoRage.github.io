import {PlayerModel} from "../models/PlayerModel"

export class PlayerManager {
    static getNextPlayerId(playerModel: PlayerModel): number {
        var currentMaxId = 0
        playerModel.players.map(player => {
            currentMaxId = Math.max(player.id, currentMaxId)
        })
        return currentMaxId + 1
    }
}