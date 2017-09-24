import {TileType, Color} from "../models/TileModel"
import {ResourceType} from "../models/ResourceModel"

// export const grass = new TileType("grass", "Green and fluffy", 3, "grass")

export const whiteTile = new TileType("white", new Color(255, 255, 255, 255))
export const yellowTile = new TileType("yellow", new Color(202, 175, 96, 255))
export const redTile = new TileType("red", new Color(196, 78, 80, 255))
export const blueTile = new TileType("blue", new Color(96, 116, 202, 255))
export const greenTile = new TileType("green", new Color(64, 191, 86, 255))
export const violetTile = new TileType("violet", new Color(181, 86, 199, 255))
export const blackTile = new TileType("black", new Color(22, 22, 22, 255))

export const tileTypes = [whiteTile, yellowTile, redTile, blueTile, greenTile, violetTile, blackTile]