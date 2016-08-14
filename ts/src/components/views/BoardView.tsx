/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import {Button} from "./UI"
import {View} from "../models/View"
import {MainMenu} from "./MainMenu"
import {Board} from "../models/BoardModel"

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
        
        var tileHeight = 200
        var cos30deg = Math.cos(Math.PI/6)
        var tileWidth = Math.ceil(cos30deg * tileHeight)

        this.state = {
            board: new Board(1, 1),
            tileHeight: tileHeight,
            tileWidth: tileWidth,
            tileSpacing: 5
        }
    }

    getTilePath(x: number, y: number, originLeft: number, originTop: number) {
        var tileHeight = this.state.tileHeight
        var tileWidth = this.state.tileWidth
        var tileSpacing = this.state.tileSpacing

        var oddRowOffsetX = (tileWidth + tileSpacing)/2
        var offsetY = tileHeight/4
        var offsetX = y%2 == 0 ? 0 : oddRowOffsetX

        var absoluteX = originLeft + x * (tileWidth + tileSpacing) + offsetX
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

    getBoardPxWidth() {
        var widthMax = 0
        var widthMin = 0
        var heightMax = 0
        var heightMin = 0
        var tiles = this.state.board.tiles
        Object.keys(tiles).map(xIndex => {
            Object.keys(tiles[+xIndex]).map(yIndex => {
                widthMax = Math.max(widthMax, Math.max(+xIndex, +xIndex + Math.abs(+yIndex)/2))
                widthMin = Math.min(widthMin, +xIndex - +yIndex/2)
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

    handleNewTileClick() {
        
    }

    render() {
        var tiles = this.state.board.tiles
        var boardSize = this.getBoardPxWidth()
        var paths: any[] = []
        Object.keys(tiles).map(xIndex => {
            Object.keys(tiles[+xIndex]).map(yIndex => {
                var path = this.getTilePath(+xIndex, +yIndex, boardSize.originLeft, boardSize.originTop)
                var d = "M " + path.top.x + "," + path.top.y
                    + " l " + path.topRight.x + "," + path.topRight.y
                    + " l " + path.bottomRight.x + "," + path.bottomRight.y
                    + " l " + path.bottom.x + "," + path.bottom.y
                    + " l " + path.bottomleft.x + "," + path.bottomleft.y
                    + " l " + path.topLeft.x + "," + path.topLeft.y
                paths.push(
                    <path
                        onClick={this.handleTileClick.bind(this)}
                        className={"tile-anchor" + (+xIndex == 0 && +yIndex == 0 ? " start" : "")}
                        d={d}
                        key={xIndex + "_" + yIndex}>
                        {xIndex + ":" + yIndex}
                    </path>
                )
            })
        })

        return (
            <div id="view-board" className="view">
                <Button text="Main Menu" id="board-main-menu-button" onClick={this.handleMenuClick.bind(this)}></Button>
                <Button text="New Tile" id="board-new-tile-button" onClick={this.handleNewTileClick.bind(this)}></Button>
                <div id="board" style={{width: boardSize.width, height: boardSize.height}}>
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