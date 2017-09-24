import {BoardManager} from "../managers/BoardManager"
import {Tile, TileType} from "./TileModel"
import {whiteTile} from "../database/Database"

export class BoardModel {
    tiles: {[x: string]: {[y: string]: Tile}}
    unexplored: {[x: string]: {[y: string]: Tile}}
    // private bounds: {widthMin: number, widthMax: number, heightMin: number, heightMax: number}

    constructor(json?: string) {
        // TODO create tiles from json
        this.tiles = {
            "0": {}
        }

        // <REMOVE ME>
        this.tiles["0"]["0"] =  new Tile("0", "0", whiteTile)
        this.unexplored = BoardManager.getUnexploredAdjacentTiles(this.tiles, "0", "0")
        // </REMOVE ME>
    }
}