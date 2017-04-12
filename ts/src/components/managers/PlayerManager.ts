import {PlayerModel, Player} from "../models/PlayerModel"

export class PlayerManager {
    static getNextPlayerId(playerModel: PlayerModel): number {
        var currentMaxId = -1
        playerModel.players.map(player => {
            if(player) {
                currentMaxId = Math.max(player.id, currentMaxId)
            }
        })
        return currentMaxId + 1
    }
}