export class Tile {
    type: TileType
    textureVariant: number

    constructor(type?: TileType) {
        this.type = type
        this.textureVariant = type ? Math.floor(Math.random()*this.type.imgVariants + 1) : 0
    }
}

export class TileType {
    name: string
    description: string
    imgVariants: number
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
    grass.imgVariants = 1
    grass.imgName = "grass_hex"
    return grass
}