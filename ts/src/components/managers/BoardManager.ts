import {App} from "../App"
import {Tile} from "../models/TileModel"
import {TileType} from "../models/TileModel"
import {TileTypes} from "../managers/TileManager"

export class BoardManager {
    static getBounds(adjacents: {[x: string]: {[y: string]: Tile}}) {
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

        // var height = tileHeight/4 + tileHeight * ((Math.abs(heightMin) + Math.abs(heightMax) + 1) * 3/4) + tileSpacing * (Math.abs(heightMin) + Math.abs(heightMax)) 

        return {
            widthMin: widthMin,
            widthMax: widthMax,
            heightMin: heightMin,
            heightMax: heightMax
        }
    }

    static addTile(x: string, y: string, tileType: TileType) {
        if(App.boardModel.tiles[x] && App.boardModel.tiles[x][y]) {
            console.error("Cannot create new tile: coordinates are taken")
        } else if(!App.boardModel.adjacents[x] || !App.boardModel.adjacents[x][y]) {
            console.error("Cannot create new tile: coordinates are unreachable")
        }
        // TODO get tile from json
        if(!App.boardModel.tiles[x]) {
                App.boardModel.tiles[x] = {}
        }

        delete App.boardModel.adjacents[x][y]
        if(Object.keys(App.boardModel.adjacents[x]).length == 0) {
            delete App.boardModel.adjacents[x]
        }

        // <REMOVE ME>
        App.boardModel.tiles[x][y] = new Tile(TileTypes.grass)
        // </REMOVE ME>

        App.boardModel.adjacents = BoardManager.mergeBoards(App.boardModel.adjacents, BoardManager.getAdjacentsForTile(App.boardModel.tiles, x, y))
        App.boardModel.bounds = BoardManager.getBounds(App.boardModel.adjacents)
    }

    // static addRandomTile() {
    //     var availables = App.board.adjacents
    //     var randomX = Object.keys(availables)[Math.floor(Math.random() * Object.keys(availables).length)]
    //     var randomY = Object.keys(availables[randomX])[Math.floor(Math.random() * Object.keys(availables[randomX]).length)]
    //     if(App.board.tiles[randomX] && App.board.tiles[randomX][randomY]) {
    //         console.error("Cannot create new tile: coordinates are taken")
    //     } else {
    //         if(!App.board.tiles[randomX]) {
    //             App.board.tiles[randomX] = {}
    //         }
    //         App.board.tiles[randomX][randomY] = new Tile(getTileTypes().grass)
    //     }
    //    App.board.adjacents = App.board.getAdjacents()
    // }

    /**
     * Returns a board-like object that is a merge of the two board-like objects from the parameters. Board1 is being prioritized on common coordinates.
     */
    static mergeBoards(board1: {[x: string]: {[y: string]: Tile}}, board2: {[x: string]: {[y: string]: Tile}}) : {[x: string]: {[y: string]: Tile}} {
        var result: {[x: string]: {[y: string]: Tile}} = {}
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

    static getAdjacents() : {[x: string]: {[y: string]: Tile}} {
        var tiles = App.boardModel.tiles
        var availables: {[x: string]: {[y: string]: Tile}} = {}
        // TODO performance for large boards might be disastrous
        Object.keys(tiles).map(xIndex => {
            Object.keys(tiles[+xIndex]).map(yIndex => {
                availables = BoardManager.mergeBoards(availables, BoardManager.getAdjacentsForTile(tiles, xIndex, yIndex))
            })
        })
        return availables
    }

    static getAdjacentsForTile(tiles: {[x: string]: {[y: string]: Tile}}, x: string, y: string) : {[x: string]: {[y: string]: Tile}} {
        var availables: {[x: string]: {[y: string]: Tile}} = {}
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
                availables[xPlusOne][y] = new Tile()
            }
            // tile on the bottom right
            if(!tiles[x] || !tiles[x][yPlusOne]) {
                if(!availables[x]) {
                    availables[x] = {}
                }
                availables[x][yPlusOne] = new Tile()
            }
            // tile on the bottom left 
            if(!tiles[xMinusOne] || !tiles[xMinusOne][yPlusOne]) {
                if(!availables[xMinusOne]) {
                    availables[xMinusOne] = {}
                }
                availables[xMinusOne][yPlusOne] = new Tile()
            }
            // tile on the left 
            if(!tiles[xMinusOne] || !tiles[xMinusOne][y]) {
                if(!availables[xMinusOne]) {
                    availables[xMinusOne] = {}
                }
                availables[xMinusOne][y] = new Tile()
            }
            // tile on the top left 
            if(!tiles[x] || !tiles[x][yMinusOne]) {
                if(!availables[x]) {
                    availables[x] = {}
                }
                availables[x][yMinusOne] = new Tile()
            }
            // tile on the top right
            if(!tiles[xPlusOne] || !tiles[xPlusOne][yMinusOne]) {
                if(!availables[xPlusOne]) {
                    availables[xPlusOne] = {}
                }
                availables[xPlusOne][yMinusOne] = new Tile()
            }
        } else {
            return null
        }
        return availables
    }
}