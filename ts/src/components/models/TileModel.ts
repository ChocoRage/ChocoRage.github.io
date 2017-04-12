export class Tile {
    type: TileType
    textureVariant: number
    x: string
    y: string
    controllingPlayerId: number = -1

    constructor(x: string, y: string, type?: TileType, textureVariant?: number) {
        this.x = x
        this.y = y
        this.type = type
        this.textureVariant = textureVariant || type ? Math.floor(Math.random()*this.type.textureVariants + 1) : null
    }
}

export class TileType {
    name: string
    description: string
    textureVariants: number
    textureName: string

    constructor(name: string, description: string, textureVariants: number, textureName: string) {
        this.name = name
        this.description = description
        this.textureName = textureName
        this.textureVariants = textureVariants
    }
}
