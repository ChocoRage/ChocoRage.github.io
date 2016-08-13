import {Tile, TileType, getTileTypes} from './TileModel'

export class Board {
    w: number
    h: number
    tileHeight: number
    tiles: Tile[][]
    tileSpacing: number

    constructor(boardWidth: number, boardHeight: number, tileHeight: number, tileSpacing: number) {
        this.w = boardWidth
        this.h = boardHeight
        this.tileHeight = tileHeight
        this.tileSpacing = tileSpacing

        var cos30deg = Math.cos(Math.PI/6);
        var tileWidth = Math.ceil(cos30deg * tileHeight);
        var oddRowOffsetX = (tileWidth + tileSpacing)/2
        var offsetY = tileHeight/4

        this.tiles = []

        for(var i = 0; i < boardWidth; i++) {
            this.tiles[i] = []
            for(var j = 0; j < boardHeight; j++) {
                var offsetX = i%2 == 0 ? 0 : oddRowOffsetX
                this.tiles[i][j] = new Tile(getTileTypes().grass, j * (tileWidth + tileSpacing) - offsetX, i * (tileHeight + tileSpacing - offsetY), tileHeight)
            }
        }
    }
}