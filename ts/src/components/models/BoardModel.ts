import {BoardManager} from "../managers/BoardManager"
import {TileModel, TileType} from './TileModel'
import {grass} from "../managers/TileManager"

export class BoardModel {
    tiles: {[x: string]: {[y: string]: TileModel}}
    unexplored: {[x: string]: {[y: string]: TileModel}}
    // private bounds: {widthMin: number, widthMax: number, heightMin: number, heightMax: number}

    constructor(json?: string) {
        // TODO create tiles from json
        this.tiles = {
            "0": {}
        }

        // <REMOVE ME>
        this.tiles["0"]["0"] =  new TileModel("0", "0", grass)
        this.unexplored = BoardManager.getUnexploredAdjacentTiles(this.tiles, "0", "0")
        // </REMOVE ME>
    }
}