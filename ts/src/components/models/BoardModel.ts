import {BoardManager} from "../managers/BoardManager"
import {TileModel, TileType} from './TileModel'
import {TileTypes} from "../managers/TileManager"

export class BoardModel {
    tiles: {[x: string]: {[y: string]: TileModel}}
    adjacents: {[x: string]: {[y: string]: TileModel}}
    // private bounds: {widthMin: number, widthMax: number, heightMin: number, heightMax: number}

    constructor(json?: string) {
        // TODO create tiles from json
        this.tiles = {
            "0": {}
        }

        // <REMOVE ME>
        this.tiles["0"]["0"] =  new TileModel("0", "0", TileTypes.grass)
        this.adjacents = BoardManager.getAdjacentsForTile(this.tiles, "0", "0")
        // this.bounds = BoardManager.getBounds(this.adjacents)
        // </REMOVE ME>
    }

    getBounds() {
        return BoardManager.getBounds(this.adjacents)
    }
}