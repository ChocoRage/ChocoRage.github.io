export class Tile {
    type: TileType
    textureVariant: number

    constructor(type?: TileType) {
        this.type = type
        this.textureVariant = type ? Math.floor(Math.random()*this.type.textureVariants + 1) : 0
    }
}

export class TileType {
    name: string
    description: string
    textureVariants: number
    textureName: string
}

export function getTileTypes() {
    return {
        grass: GRASS()
    }
}

export function getTileType(type?: string) {
    var allTypes: any = getTileTypes()
    for(var i = 0; i < Object.keys(allTypes).length; i++) {
        var currentType: any = Object.keys(allTypes)[i]
        if(allTypes[currentType].name == type) {
            return allTypes[currentType]
        }
    }
}

function GRASS() {
    var grass = new TileType()
    grass.name = "Grass"
    grass.description = "Green and fluffy"
    grass.textureVariants = 5
    grass.textureName = "grass"
    return grass
}