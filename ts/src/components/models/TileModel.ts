export class Tile {
    type: TileType
    x: number
    y: number

    constructor(type: TileType, x: number, y: number) {
        this.type = type
        this.x = x
        this.y = y
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