import {TileType, Color, TileResourceCost} from "../models/TileModel"
import {ResourceType} from "../models/ResourceModel"

// ======================================= Resources =======================================
export const energyResource = new ResourceType("Energy", "⚡")
export const scoreResource = new ResourceType("Score", "🏆")

export const resourceTypes = [energyResource, scoreResource]

// ======================================= Tiles =======================================
export const whiteColor = new Color(255, 255, 255, 255)
export const yellowColor = new Color(202, 175, 96, 255)
export const redColor = new Color(196, 78, 80, 255)
export const blueColor =new Color(96, 116, 202, 255)
export const greenColor = new Color(64, 191, 86, 255)
export const violetColor = new Color(181, 86, 199, 255)
export const blackCoolor =new Color(22, 22, 22, 255)

export const whiteTile = new TileType("white", whiteColor, [new TileResourceCost(energyResource, 1)])
export const yellowTile = new TileType("yellow", yellowColor, [new TileResourceCost(energyResource, 3)])
export const redTile = new TileType("red", redColor, [new TileResourceCost(energyResource, 4)])
export const blueTile = new TileType("blue", blueColor, [new TileResourceCost(energyResource, 5), new TileResourceCost(scoreResource, 1)])
export const greenTile = new TileType("green", greenColor, [new TileResourceCost(energyResource, 6)])
export const violetTile = new TileType("violet", violetColor, [new TileResourceCost(energyResource, 7)])
export const blackTile = new TileType("black", blackCoolor, [new TileResourceCost(energyResource, 8), new TileResourceCost(scoreResource, 2)])

export const tileTypes = [whiteTile, yellowTile, redTile, blueTile, greenTile, violetTile, blackTile]