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
        tileWidth: number,
        tileSpacing: number,
        selectedTile: {x: number, y: number},
        zoom: number
    }> {
    
    constructor() {
        super()
        
        var tileHeight = 300
        var cos30deg = Math.cos(Math.PI/6)
        var tileWidth = Math.ceil(cos30deg * tileHeight)

        this.state = {
            board: new Board(1, 1),
            tileHeight: tileHeight,
            tileWidth: tileWidth,
            tileSpacing: 5,
            selectedTile: null,
            zoom: 1
        }
    }

    getTilePath(x: number, y: number, originLeft: number, originTop: number) {
        var tileHeight = this.state.tileHeight
        var tileWidth = this.state.tileWidth
        var tileSpacing = this.state.tileSpacing

        var offsetX = (tileWidth + tileSpacing)/2
        var offsetY = tileHeight/4

        var absoluteX = originLeft + x * (tileWidth + tileSpacing) + y * offsetX
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
                widthMax = Math.max(widthMax, +xIndex + +yIndex/2)
                widthMin = Math.min(widthMin, +xIndex + +yIndex/2)
                heightMax = Math.max(heightMax, +yIndex)
                heightMin = Math.min(heightMin, +yIndex)
            })
        })
        var tileHeight = this.state.tileHeight
        var tileWidth = this.state.tileWidth
        var tileSpacing = this.state.tileSpacing

        var originLeft = Math.abs((tileWidth + tileSpacing) * Math.abs(widthMin) + tileWidth/2)
        var originTop = Math.abs(heightMin * tileHeight * 3/4 + heightMin * tileSpacing)

        var width = tileWidth * (Math.max(widthMax, Math.abs(widthMin))*2 + 1) + tileSpacing * (Math.max(widthMax, Math.abs(widthMin))*2) 
        var height = tileHeight + tileHeight * 3 * (Math.max(heightMax, Math.abs(heightMin))*2)/4 + (Math.max(heightMax, Math.abs(heightMin))*2) * tileSpacing

        return {
            originLeft: originLeft,
            originTop: originTop,
            width: width,
            height: height
        }
    }

    handleMenuClick() {
        {this.props.changeView(new View(MainMenu))}
    }

    handleTileClick(e: any) {
        var xClicked = e.target.getAttribute("data-x")
        var yClicked = e.target.getAttribute("data-y")
        if(this.state.selectedTile && this.state.selectedTile.x == xClicked && this.state.selectedTile.y == yClicked) {
            this.state.selectedTile = null
        } else {
            this.state.selectedTile = {x: xClicked, y: yClicked}
        }
        this.setState(this.state)
    }

    handleAdjacentTileClick(e: any) {
        var x = e.target.attributes["data-x"].nodeValue
        var y = e.target.attributes["data-y"].nodeValue
        this.state.board.addTile(x, y)
        this.setState(this.state)
    }

    handleAddNewTileClick() {
        this.state.board.addRandomTile()
        this.setState(this.state)
    }

    handleOnWheel(e: React.WheelEvent) {
        var sign = e.deltaY / Math.abs(e.deltaY)
        this.state.zoom = Math.max(0.2, Math.min(this.state.zoom - (sign * 0.1), 2.5))
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
                var classNameStart = (+xIndex == 0 && +yIndex == 0 ? "start" : "")
                var classNameSelected = (this.state.selectedTile && +xIndex == this.state.selectedTile.x && +yIndex == this.state.selectedTile.y ? " selected" : "")
                paths.push(
                    <TileView
                        tile={tiles[xIndex][yIndex]}
                        onClick={this.handleTileClick.bind(this)}
                        className={classNameStart + classNameSelected}
                        path={path}
                        key={xIndex + "_" + yIndex}
                        x={xIndex}
                        y={yIndex}
                        width={this.state.tileWidth}
                        height={this.state.tileHeight}>
                    </TileView>
                )
            })
        })
        Object.keys(adjacents).map(xIndex => {
            Object.keys(adjacents[+xIndex]).map(yIndex => {
                var path = this.getTilePath(+xIndex, +yIndex, adjacentsSize.originLeft, adjacentsSize.originTop)
                paths.push(
                    <TileView
                        tile={adjacents[xIndex][yIndex]}
                        onClick={this.handleAdjacentTileClick.bind(this)}
                        className={"tile adjacent" + (+xIndex == 0 && +yIndex == 0 ? " start" : "")}
                        path={path}
                        key={"a" + xIndex + "_" + yIndex}
                        x={xIndex}
                        y={yIndex}
                        width={this.state.tileWidth}
                        height={this.state.tileHeight}>
                    </TileView>
                )
            })
        })

        var svgTop = -(adjacentsSize.originTop + this.state.tileHeight / 2) + window.innerHeight / 2;
        var svgLeft = (-adjacentsSize.originLeft) + window.innerWidth / 2;

        return (
            <div id="view-board" className="view" onWheel={this.handleOnWheel.bind(this)}>
                <Button text="Main Menu" id="board-main-menu-button" onClick={this.handleMenuClick.bind(this)}></Button>
                <Button text="New Tile" id="board-new-tile-button" onClick={this.handleAddNewTileClick.bind(this)}></Button>
                <div id="board" style={{transform: "scale(" + this.state.zoom + ")"}}>
                    <svg id="board-svg" width={adjacentsSize.width} height={adjacentsSize.height} style={{top: svgTop, left: svgLeft}}>
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
        tile: Tile,
        onClick?: ()=>void,
        className?: string,
        path: {
            top: {x: number, y: number},
            topRight: {x: number, y: number},
            bottomRight: {x: number, y: number},
            bottom: {x: number, y: number},
            bottomleft: {x: number, y: number},
            topLeft: {x: number, y: number}
        },
        x: string,
        y: string,
        height: number,
        width: number
    }, {
    }> {
    
    constructor() {
        super()
    }

    render() {
        var img: any
        if (this.props.tile && this.props.tile.type) {
            img = require('../../../assets/images/' + this.props.tile.type.textureName + this.props.tile.textureVariant + ".png")
        }
        var path = this.props.path
        var d = "M " + path.top.x + "," + path.top.y
            + " l " + path.topRight.x + "," + path.topRight.y
            + " l " + path.bottomRight.x + "," + path.bottomRight.y
            + " l " + path.bottom.x + "," + path.bottom.y
            + " l " + path.bottomleft.x + "," + path.bottomleft.y
            + " l " + path.topLeft.x + "," + path.topLeft.y + "z"
        return (
            <g >
                {this.props.tile && this.props.tile.type ? 
                    <image
                        className={"tile-image" + (this.props.className ? " " + this.props.className : "")}
                        xlinkHref={img}
                        x={path.top.x}
                        y={path.top.y}
                        height={this.props.height}
                        width={this.props.width}>
                    </image> : null
                }
                <path
                    ref="path"
                    onClick={this.props.onClick.bind(this)}
                    className={"tile" + (this.props.className ? " " + this.props.className : "")}
                    d={d}
                    data-x={this.props.x}
                    data-y={this.props.y}>
                </path>
            </g>
        )
    }
}