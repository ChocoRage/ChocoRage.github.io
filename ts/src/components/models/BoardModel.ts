import {Tile, TileType, getTileTypes} from './TileModel'

export class Board {
    tiles: {[x: string]: {[y: string]: Tile}}

    constructor(tileHeight: number, tileSpacing: number, json?: string) {
        this.tiles = {
            "0": {}
        }
        this.tiles["0"]["0"] =  new Tile(getTileTypes().grass, 0, 0)
    }

    addRandomTile() {
        this.getAvailableSpaces()
    }

    getAvailableSpaces() {
        var tiles = this.tiles
        var availables: {[x: string]: {[y: string]: Tile}}
        var adjacents: {[x: string]: {[y: string]: Tile}}
        Object.keys(tiles).map(xIndex => {
            Object.keys(tiles[+xIndex]).map(yIndex => {
            })
        })
    }
}