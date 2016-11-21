import {BoardManager} from "../managers/BoardManager"
import {Tile, TileType} from './TileModel'
import {TileTypes} from "../managers/TileManager"

export class BoardModel {
    tiles: {[x: string]: {[y: string]: Tile}}
    adjacents: {[x: string]: {[y: string]: Tile}}
    bounds: {widthMin: number, widthMax: number, heightMin: number, heightMax: number}

    constructor(json?: string) {
        // TODO create tiles from json
        this.tiles = {
            "0": {}
        }

        // <REMOVE ME>
        this.tiles["0"]["0"] =  new Tile(TileTypes.grass)
        this.adjacents = BoardManager.getAdjacentsForTile(this.tiles, "0", "0")
        this.bounds = BoardManager.getBounds(this.adjacents)
        // </REMOVE ME>
    }
}