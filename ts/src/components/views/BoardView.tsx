/// <reference path="../../../typings/index.d.ts" />
declare var require: any
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button} from "./UI"
import {View} from "../models/View"
import {MainMenu} from "./MainMenu"
import {Board} from "../models/BoardModel"
import {Tile} from "../models/TileModel"

export class BoardView extends React.Component<{
        changeView: (newVew: View)=>void
    }, {
        board: Board,
        tileHeight: number,
        tileWidth: number
        tileSpacing: number
    }> {
    
    constructor() {
        super()
        
        var tileHeight = 100
        var cos30deg = Math.cos(Math.PI/6)
        var tileWidth = Math.ceil(cos30deg * tileHeight)

        this.state = {
            board: new Board(1, 1),
            tileHeight: tileHeight,
            tileWidth: tileWidth,
            tileSpacing: 3
        }
    }

    getTilePath(x: number, y: number, originLeft: number, originTop: number) {
        var tileHeight = this.state.tileHeight
        var tileWidth = this.state.tileWidth
        var tileSpacing = this.state.tileSpacing

        var offsetX = (tileWidth + tileSpacing)/2
        var offsetY = tileHeight/4

        var absoluteX = originLeft + x * (tileWidth + tileSpacing) + Math.abs(y) * offsetX
        var absoluteY = originTop + y * (tileHeight + tileSpacing - offsetY)

        return {
            top: {x: absoluteX, y: absoluteY},
            topRight: {x: tileWidth/2, y: tileHeight/4},
            bottomRight: {x: 0, y: tileHeight/2},
            bottom: {x: -tileWidth/2, y: tileHeight/4},
            bottomleft: {x: -tileWidth/2, y: -tileHeight/4},
            topLeft: {x: 0, y: -tileHeight/2}
        }
    }

    getBoardPxWidth(tiles: {[x: string]: {[y: string]: Tile}}) {
        var widthMax = 0
        var widthMin = 0
        var heightMax = 0
        var heightMin = 0
        Object.keys(tiles).map(xIndex => {
            Object.keys(tiles[+xIndex]).map(yIndex => {
                widthMax = Math.max(widthMax, +xIndex + Math.abs(+yIndex)/2)
                widthMin = Math.min(widthMin, +xIndex + Math.abs(+yIndex)/2)
                heightMax = Math.max(heightMax, +yIndex)
                heightMin = Math.min(heightMin, +yIndex)
            })
        })
        var tileHeight = this.state.tileHeight
        var tileWidth = this.state.tileWidth
        var tileSpacing = this.state.tileSpacing

        var originLeft = Math.abs((tileWidth + tileSpacing) * Math.abs(widthMin) + tileWidth/2)
        var originTop = Math.abs(heightMin * tileHeight * 3/4 + heightMin * tileSpacing)

        var width = tileWidth * (widthMax + Math.abs(widthMin) + 1) + tileSpacing * (widthMax + Math.abs(widthMin)) 
        var height = tileHeight + tileHeight * 3 * (heightMax + Math.abs(heightMin))/4 + (heightMax + Math.abs(heightMin)) * tileSpacing

        return {
            originLeft: originLeft,
            originTop: originTop,
            width: width,
            height: height
        }
    }

    handleMenuClick = () => {
        {this.props.changeView(new View(MainMenu))}
    }

    handleTileClick(e: any) {
        console.log(e.target)
    }

    handleAdjacentTileClick(e: any) {
        var x = e.target.attributes["data-x"].nodeValue
        var y = e.target.attributes["data-y"].nodeValue
        this.state.board.addTile(x, y)
        this.setState(this.state)
    }

    handleNewTileClick() {
        this.state.board.addRandomTile()
        this.setState(this.state)
    }

    render() {
        
        var tiles = this.state.board.tiles
        var adjacents = this.state.board.adjacents
        // var boardSize = this.getBoardPxWidth(tiles)
        var adjacentsSize = this.getBoardPxWidth(adjacents)
        var paths: any[] = []
        Object.keys(tiles).map(xIndex => {
            Object.keys(tiles[+xIndex]).map(yIndex => {
                var path = this.getTilePath(+xIndex, +yIndex, adjacentsSize.originLeft, adjacentsSize.originTop)
                var d = "M " + path.top.x + "," + path.top.y
                    + " l " + path.topRight.x + "," + path.topRight.y
                    + " l " + path.bottomRight.x + "," + path.bottomRight.y
                    + " l " + path.bottom.x + "," + path.bottom.y
                    + " l " + path.bottomleft.x + "," + path.bottomleft.y
                    + " l " + path.topLeft.x + "," + path.topLeft.y
                paths.push(
                    <TileView
                        onClick={this.handleTileClick.bind(this)}
                        className={"tile" + (+xIndex == 0 && +yIndex == 0 ? " start" : "")}
                        d={d}
                        key={xIndex + "_" + yIndex}
                        x={xIndex}
                        y={yIndex}>
                    </TileView>
                )
            })
        })
        Object.keys(adjacents).map(xIndex => {
            Object.keys(adjacents[+xIndex]).map(yIndex => {
                var path = this.getTilePath(+xIndex, +yIndex, adjacentsSize.originLeft, adjacentsSize.originTop)
                var d = "M " + path.top.x + "," + path.top.y
                    + " l " + path.topRight.x + "," + path.topRight.y
                    + " l " + path.bottomRight.x + "," + path.bottomRight.y
                    + " l " + path.bottom.x + "," + path.bottom.y
                    + " l " + path.bottomleft.x + "," + path.bottomleft.y
                    + " l " + path.topLeft.x + "," + path.topLeft.y
                paths.push(
                    <TileView
                        onClick={this.handleAdjacentTileClick.bind(this)}
                        className={"tile adjacent" + (+xIndex == 0 && +yIndex == 0 ? " start" : "")}
                        d={d}
                        key={"a" + xIndex + "_" + yIndex}
                        x={xIndex}
                        y={yIndex}>
                    </TileView>
                )
            })
        })

        return (
            <div id="view-board" className="view">
                <Button text="Main Menu" id="board-main-menu-button" onClick={this.handleMenuClick.bind(this)}></Button>
                <Button text="New Tile" id="board-new-tile-button" onClick={this.handleNewTileClick.bind(this)}></Button>
                <svg width="660" height="220">
                    <defs>
                        <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stop-color="#05a"/>
                        <stop offset="100%" stop-color="#0a5"/>
                        </linearGradient>
                    </defs>

                    <rect x="10" y="10" width="600" height="200" fill="url(#linear)" />
                </svg>
                <div id="board" style={{width: adjacentsSize.width, height: adjacentsSize.height}}>
                    <svg id="board-svg" width="100%" height="100%">
                        
                        <g id="board-g">
                            {paths.map(path =>
                                path
                            )}
                        </g>
                    </svg>
                </div>
            </div>
        )
    }
}

export class TileView extends React.Component<{
        onClick?: ()=>void,
        className?: string,
        d: string,
        x: string,
        y: string
    }, {
    }> {
    
    constructor() {
        super()
    }

    render() {

        return (
            <path
                ref="path"
                onClick={this.props.onClick.bind(this)}
                className={this.props.className}
                d={this.props.d}
                data-x={this.props.x}
                data-y={this.props.y}>
            </path>
        )
    }
}