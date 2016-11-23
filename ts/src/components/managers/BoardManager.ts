import {TileModel} from "../models/TileModel"
import {TileType} from "../models/TileModel"
import {TileTypes} from "../managers/TileManager"
import {BoardModel} from "../models/BoardModel"
import {EventBus} from "./GameManager"

export class BoardManager {
    static getBounds(adjacents: {[x: string]: {[y: string]: TileModel}}) {
        var widthMax = 0
        var widthMin = 0
        var heightMax = 0
        var heightMin = 0
        Object.keys(adjacents).map(xIndex => {
            Object.keys(adjacents[+xIndex]).map(yIndex => {
                widthMax = Math.max(widthMax, +xIndex + +yIndex/2)
                widthMin = Math.min(widthMin, +xIndex + +yIndex/2)
                heightMax = Math.max(heightMax, +yIndex)
                heightMin = Math.min(heightMin, +yIndex)
            })
        })

        return {
            widthMin: widthMin,
            widthMax: widthMax,
            heightMin: heightMin,
            heightMax: heightMax
        }
    }

    static addTile(boardModel: BoardModel, tile: TileModel): BoardModel {
        if(boardModel.tiles[tile.x] && boardModel.tiles[tile.x][tile.y]) {
            console.error("Cannot create new tile: coordinates are taken")
        } else if(!boardModel.adjacents[tile.x] || !boardModel.adjacents[tile.x][tile.y]) {
            console.error("Cannot create new tile: coordinates are unreachable")
        }
        // TODO get tile from json
        if(!boardModel.tiles[tile.x]) {
                boardModel.tiles[tile.x] = {}
        }

        delete boardModel.adjacents[tile.x][tile.y]
        if(Object.keys(boardModel.adjacents[tile.x]).length == 0) {
            delete boardModel.adjacents[tile.x]
        }

        // <REMOVE ME>
        boardModel.tiles[tile.x][tile.y] = new TileModel(tile.x, tile.y, TileTypes.grass)
        // </REMOVE ME>

        boardModel.adjacents = BoardManager.mergeBoards(boardModel.adjacents, BoardManager.getAdjacentsForTile(boardModel.tiles, tile.x, tile.y))
        return boardModel
    }

    /**
     * Returns a board-like object that is a merge of the two board-like objects from the parameters. Board1 is being prioritized on common coordinates.
     */
    static mergeBoards(board1: {[x: string]: {[y: string]: TileModel}}, board2: {[x: string]: {[y: string]: TileModel}}) : {[x: string]: {[y: string]: TileModel}} {
        var result: {[x: string]: {[y: string]: TileModel}} = {}
        Object.keys(board2).map(xIndex => {
            Object.keys(board2[+xIndex]).map(yIndex => {
                if(!result[xIndex]) {
                    result[xIndex] = {}
                }
                result[xIndex][yIndex] = board2[xIndex][yIndex] 
            })
        })
        Object.keys(board1).map(xIndex => {
            Object.keys(board1[+xIndex]).map(yIndex => {
                if(!result[xIndex]) {
                    result[xIndex] = {}
                }
                result[xIndex][yIndex] = board1[xIndex][yIndex] 
            })
        })
        return result
    }

    static getAdjacents(boardModel: BoardModel) : {[x: string]: {[y: string]: TileModel}} {
        var tiles = boardModel.tiles
        var availables: {[x: string]: {[y: string]: TileModel}} = {}
        Object.keys(tiles).map(xIndex => {
            Object.keys(tiles[+xIndex]).map(yIndex => {
                availables = BoardManager.mergeBoards(availables, BoardManager.getAdjacentsForTile(tiles, xIndex, yIndex))
            })
        })
        return availables
    }

    static getAdjacentsForTile(tiles: {[x: string]: {[y: string]: TileModel}}, x: string, y: string) : {[x: string]: {[y: string]: TileModel}} {
        var availables: {[x: string]: {[y: string]: TileModel}} = {}
        if(tiles && tiles[x] && tiles[x][y]) {
            var xPlusOne = "" + (+x + 1)
            var xMinusOne = "" + (+x - 1)
            var yPlusOne = "" + (+y + 1)
            var yMinusOne = "" + (+y - 1)
            var xBottomLeft: string
            var xBottomRight: string
            var xTopRight: string
            var xTopLeft: string

            // tile on the right
            if(!tiles[xPlusOne] || !tiles[xPlusOne][y]) {
                if(!availables[xPlusOne]) {
                    availables[xPlusOne] = {}
                }
                availables[xPlusOne][y] = new TileModel(""+xPlusOne, ""+y, null)
            }
            // tile on the bottom right
            if(!tiles[x] || !tiles[x][yPlusOne]) {
                if(!availables[x]) {
                    availables[x] = {}
                }
                availables[x][yPlusOne] = new TileModel(""+x, ""+yPlusOne, null)
            }
            // tile on the bottom left 
            if(!tiles[xMinusOne] || !tiles[xMinusOne][yPlusOne]) {
                if(!availables[xMinusOne]) {
                    availables[xMinusOne] = {}
                }
                availables[xMinusOne][yPlusOne] = new TileModel(""+xMinusOne, ""+yPlusOne, null)
            }
            // tile on the left 
            if(!tiles[xMinusOne] || !tiles[xMinusOne][y]) {
                if(!availables[xMinusOne]) {
                    availables[xMinusOne] = {}
                }
                availables[xMinusOne][y] = new TileModel(""+xMinusOne, ""+y, null)
            }
            // tile on the top left 
            if(!tiles[x] || !tiles[x][yMinusOne]) {
                if(!availables[x]) {
                    availables[x] = {}
                }
                availables[x][yMinusOne] = new TileModel(""+x, ""+yMinusOne, null)
            }
            // tile on the top right
            if(!tiles[xPlusOne] || !tiles[xPlusOne][yMinusOne]) {
                if(!availables[xPlusOne]) {
                    availables[xPlusOne] = {}
                }
                availables[xPlusOne][yMinusOne] = new TileModel(""+xPlusOne, ""+yMinusOne, null)
            }
        } else {
            return null
        }
        return availables
    }
}