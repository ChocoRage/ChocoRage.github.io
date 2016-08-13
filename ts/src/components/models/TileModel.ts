export class Tile {
    type: TileType

    path: {
        top: {x: number, y: number},
        topRight: {x: number, y: number},
        bottomRight: {x: number, y: number},
        bottom: {x: number, y: number},
        bottomleft: {x: number, y: number},
        topLeft: {x: number, y: number}
    }

    constructor(type: TileType, xAbsolute: number, yAbsolute: number, tileHeight: number) {
        this.type = type
        var cos30deg = Math.cos(Math.PI/6)
        var height = tileHeight
        var width = Math.ceil(cos30deg * height)
        this.path = {
            top: {x: xAbsolute, y: yAbsolute},
            topRight: {x: width/2, y: height/4},
            bottomRight: {x: 0, y: height/2},
            bottom: {x: -width/2, y: height/4},
            bottomleft: {x: -width/2, y: -height/4},
            topLeft: {x: 0, y: -height/2}
        }
    }
}

export class TileType {
    name: string
    description: string
    imgName: string
}

export function getTileTypes() {
    return {
        grass: GRASS()
    }
}

function GRASS() {
    var grass = new TileType()
    grass.name = "Grass"
    grass.description = "Green and fluffy"
    grass.imgName = null
    return grass
}