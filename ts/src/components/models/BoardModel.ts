import {Tile, TileType, getTileTypes} from './TileModel'

export class Board {
    tiles: {[x: string]: {[y: string]: Tile}}
    adjacents: {[x: string]: {[y: string]: Tile}}

    constructor(tileHeight: number, tileSpacing: number, json?: string) {
        // TODO create tiles from json
        this.tiles = {
            "0": {}
        }

        // <REMOVE ME>
            this.tiles["0"]["0"] =  new Tile(getTileTypes().grass)
            this.adjacents = this.getAdjacentsForTile("0", "0")
            for(var i = 0; i < 10; i++) {
                this.addRandomTile()
            }
        // </REMOVE ME>
    }

    addTile(x: string, y: string) {
        if(this.tiles[x] && this.tiles[x][y]) {
            console.error("Cannot create new tile: coordinates are taken")
        } else if(!this.adjacents[x] || !this.adjacents[x][y]) {
            console.error("Cannot create new tile: coordinates are unreachable")
        } else {
            // TODO get tile from json
            if(!this.tiles[x]) {
                 this.tiles[x] = {}
            }

            delete this.adjacents[x][y]
            if(Object.keys(this.adjacents[x]).length == 0) {
                delete this.adjacents[x]
            }

            // <REMOVE ME>
                this.tiles[x][y] = new Tile(getTileTypes().grass)
            // </REMOVE ME>

            this.adjacents = this.mergeBoards(this.adjacents, this.getAdjacentsForTile(x, y))
        }
    }

    addRandomTile() {
        var availables = this.adjacents
        var randomX = Object.keys(availables)[Math.floor(Math.random() * Object.keys(availables).length)]
        var randomY = Object.keys(availables[randomX])[Math.floor(Math.random() * Object.keys(availables[randomX]).length)]
        if(this.tiles[randomX] && this.tiles[randomX][randomY]) {
            console.error("Cannot create new tile: coordinates are taken")
        } else {
            if(!this.tiles[randomX]) {
                this.tiles[randomX] = {}
            }
            this.tiles[randomX][randomY] = new Tile(getTileTypes().grass)
        }
       this.adjacents = this.getAdjacents()
    }

    /**
     * Returns a board-like object that is a merge of the two board-like objects from the parameters. Board1 is being prioritized on common coordinates.
     */
    mergeBoards(board1: {[x: string]: {[y: string]: Tile}}, board2: {[x: string]: {[y: string]: Tile}}) : {[x: string]: {[y: string]: Tile}} {
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

    getAdjacents() : {[x: string]: {[y: string]: Tile}} {
        var tiles = this.tiles
        var availables: {[x: string]: {[y: string]: Tile}} = {}
        // TODO performance for large boards might be disastrous
        Object.keys(tiles).map(xIndex => {
            Object.keys(tiles[+xIndex]).map(yIndex => {
                availables = this.mergeBoards(availables, this.getAdjacentsForTile(xIndex, yIndex))
            })
        })
        return availables
    }

    getAdjacentsForTile(x: string, y: string) : {[x: string]: {[y: string]: Tile}} {
        var tiles = this.tiles
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