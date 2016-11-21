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

    constructor(name: string, description: string, textureVariants: number, textureName: string) {
        this.name = name
        this.description = description
        this.textureName = textureName
        this.textureVariants = textureVariants
    }
}