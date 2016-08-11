export class Board {
    w: number
    h: number
    constructor(width: number, height: number) {
        this.w = width
        this.h = height
    }
}

export class Tile {
    type: TileType
    bounds: {
        top: number[],
        topRight: number[],
        bottomRight: number[],
        bottom: number[],
        bottomleft: number[],
        topLeft: number[]
    }

    constructor() {

    }

    
}

export class TileType {
    name: string
    description: string
    imgName: string
}

export function createBoard(width: number, height: number): Board {
    var board = new Board(width, height)

    return board
}

function getTileBounds(offset: number): {} {
    var cos30deg = Math.cos(Math.PI/6);
    var height = 300;
    var width = Math.ceil(cos30deg * height);
    var bounds = {
        top: [width/2, 0],
        topRight: [width, height/4],
        bottomRight: [width, height*3/4],
        bottom: [width/2, height],
        bottomleft: [0, height*3/4],
        topLeft: [0, height/4]
    }
    return bounds
}