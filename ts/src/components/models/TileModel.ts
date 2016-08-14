export class Tile {
    type: TileType

    constructor(type?: TileType) {
        this.type = type
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