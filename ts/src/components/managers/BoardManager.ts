import {Tile} from "../models/TileModel"
import {BoardModel} from "../models/BoardModel"
import {EventBus, GameManager} from "./GameManager"

export class BoardManager {
    static getBounds(tiles: {[x: string]: {[y: string]: Tile}}) {
        var widthMax = 0
        var widthMin = 0
        var heightMax = 0
        var heightMin = 0
        Object.keys(tiles).map(xIndex => {
            Object.keys(tiles[+xIndex]).map(yIndex => {
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

    static getUnexploredAdjacentTiles(unexplored: {[x: string]: {[y: string]: Tile}}, x: string, y: string) : {[x: string]: {[y: string]: Tile}} {
        var availables: {[x: string]: {[y: string]: Tile}} = {}
        if(unexplored && unexplored[x] && unexplored[x][y]) {
            var xPlusOne = "" + (+x + 1)
            var xMinusOne = "" + (+x - 1)
            var yPlusOne = "" + (+y + 1)
            var yMinusOne = "" + (+y - 1)
            var xBottomLeft: string
            var xBottomRight: string
            var xTopRight: string
            var xTopLeft: string

            // tile on the right
            if(!unexplored[xPlusOne] || !unexplored[xPlusOne][y]) {
                if(!availables[xPlusOne]) {
                    availables[xPlusOne] = {}
                }
                availables[xPlusOne][y] = new Tile(""+xPlusOne, ""+y, null)
            }
            // tile on the bottom right
            if(!unexplored[x] || !unexplored[x][yPlusOne]) {
                if(!availables[x]) {
                    availables[x] = {}
                }
                availables[x][yPlusOne] = new Tile(""+x, ""+yPlusOne, null)
            }
            // tile on the bottom left 
            if(!unexplored[xMinusOne] || !unexplored[xMinusOne][yPlusOne]) {
                if(!availables[xMinusOne]) {
                    availables[xMinusOne] = {}
                }
                availables[xMinusOne][yPlusOne] = new Tile(""+xMinusOne, ""+yPlusOne, null)
            }
            // tile on the left 
            if(!unexplored[xMinusOne] || !unexplored[xMinusOne][y]) {
                if(!availables[xMinusOne]) {
                    availables[xMinusOne] = {}
                }
                availables[xMinusOne][y] = new Tile(""+xMinusOne, ""+y, null)
            }
            // tile on the top left 
            if(!unexplored[x] || !unexplored[x][yMinusOne]) {
                if(!availables[x]) {
                    availables[x] = {}
                }
                availables[x][yMinusOne] = new Tile(""+x, ""+yMinusOne, null)
            }
            // tile on the top right
            if(!unexplored[xPlusOne] || !unexplored[xPlusOne][yMinusOne]) {
                if(!availables[xPlusOne]) {
                    availables[xPlusOne] = {}
                }
                availables[xPlusOne][yMinusOne] = new Tile(""+xPlusOne, ""+yMinusOne, null)
            }
        } else {
            return null
        }
        return availables
    }
}