/// <reference path="../../../typings/index.d.ts" />
declare var require: any
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button} from "./UI"
import {View} from "../models/View"
import {MainMenu} from "./MainMenu"
import {BoardModel} from "../models/BoardModel"
import {Tile, TileType} from "../models/TileModel"
import {Entity} from "../models/EntityModel"
import {BoardManager} from "../managers/BoardManager"
import {TileTypes} from "../managers/TileManager"
import {App} from "../App"


export class BoardView extends React.Component<{
        changeView: (newVew: View)=>void,
        board: BoardModel,
        entities: Entity[]
    }, {
        selectedTile: {x: number, y: number},
        zoom: number,
        scrollX: number,
        scrollY: number,
        dragging: boolean,
        dragPosition: {x: number, y: number},
        showGrid: boolean
    }> {

    private tileHeight: number
    private tileWidth: number
    private tileSpacing: number
    
    constructor() {
        super()
        
        this.tileHeight = App.tileHeight
        this.tileSpacing = App.tileSpacing
        this.tileWidth = App.tileWidth

        this.state = {
            selectedTile: null,
            scrollX: 0,
            scrollY: 0,
            zoom: 1,
            dragging: false,
            dragPosition: null,
            showGrid: true
        }
    }

    componentWillMount () {
        this.centerBoard()
    }

    getTilePath(x: number, y: number, originLeft: number, originTop: number) {
        var tileHeight = this.tileHeight
        var tileWidth = this.tileWidth
        var tileSpacing = this.tileSpacing

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

    getBoardPxSize() {
        var bounds = this.props.board.bounds

        var widthMin = (this.tileWidth + this.tileSpacing) * (Math.abs(bounds.widthMin) + 1/2)
        var widthMax = (this.tileWidth + this.tileSpacing) * (Math.abs(bounds.widthMax) + 1/2)

        var heightMin = (this.tileHeight + this.tileSpacing) * (Math.abs(bounds.heightMin) * 3/4)
        var heightMax = (this.tileHeight + this.tileSpacing) * (Math.abs(bounds.heightMax) * 3/4 + 1)

        return {
            widthMin: widthMin,
            widthMax: widthMax,
            heightMin: heightMin,
            heightMax: heightMax
        }
    }

    centerBoard () {
        this.state.scrollX = -this.getBoardPxSize().widthMin
        this.state.scrollY = -this.getBoardPxSize().heightMin - this.tileHeight / 2
        this.setState(this.state)
    }

    handleMenuClick() {
        {this.props.changeView(new View(MainMenu))}
    }

    handleTileClick(e: any) {
        if(this.state.dragging) {
            return
        }
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
        if(this.state.dragging) {
            return
        }

        var boundsBefore = this.getBoardPxSize()

        var x = e.target.attributes["data-x"].nodeValue
        var y = e.target.attributes["data-y"].nodeValue

        BoardManager.addTile(x, y, TileTypes.grass)

        var boundsAfter = this.getBoardPxSize()

        if(boundsAfter.widthMin > boundsBefore.widthMin) {
            this.state.scrollX = this.state.scrollX - Math.abs(boundsAfter.widthMin - boundsBefore.widthMin)
        }
        if(boundsAfter.heightMin > boundsBefore.heightMin) {
            this.state.scrollY = this.state.scrollY - Math.abs(boundsAfter.heightMin - boundsBefore.heightMin)
        }

        this.setState(this.state)
    }

    handleOnWheel(e: React.WheelEvent) {
        var sign = e.deltaY / Math.abs(e.deltaY)
        this.state.zoom = Math.max(0.2, Math.min(this.state.zoom - (sign * 0.1), 2.5))
        this.setState(this.state)
    }

    startDrag(e: React.MouseEvent) {
        this.state.dragPosition = {x: e.clientX, y: e.clientY}
    }

    handleDrag(e: React.MouseEvent) {
        if(!this.state.dragPosition) {
            return
        }
        this.state.dragging = true
        this.state.scrollX = this.state.scrollX + (e.clientX - this.state.dragPosition.x) * 1/this.state.zoom
        this.state.scrollY = this.state.scrollY + (e.clientY - this.state.dragPosition.y) * 1/this.state.zoom

        this.state.dragPosition.x = e.clientX
        this.state.dragPosition.y = e.clientY

        this.setState(this.state)
    }

    endDrag(e: React.MouseEvent) {
        this.state.dragPosition = null
        window.setTimeout(
            () => {
                this.state.dragging = false
                this.setState(this.state)
            }, 0
        )
    }

    handleCenterBoardClick() {
        this.centerBoard()
    }

    handleResetZoomClick() {
        this.state.zoom = 1
        this.setState(this.state)
    }

    handleToggleGrid() {
        this.state.showGrid = !this.state.showGrid
        this.setState(this.state)
    }

    handleStartGame() {

    }

    render() {
        var tiles = this.props.board.tiles
        var adjacents = this.props.board.adjacents
        var paths: any[] = []
        var boardSize = this.getBoardPxSize()
        
        var selectedTileX = ""
        var selectedTileY = ""
        if(this.state.selectedTile) {
            selectedTileX = "" + this.state.selectedTile.x
            selectedTileY = "" + this.state.selectedTile.y
        }

        Object.keys(tiles).map(xIndex => {
            Object.keys(tiles[+xIndex]).map(yIndex => {
                var path = this.getTilePath(+xIndex, +yIndex, boardSize.widthMin, boardSize.heightMin)
                var classNameStart = (+xIndex == 0 && +yIndex == 0 ? "start" : "")
                var classNameSelected = (this.state.selectedTile && +xIndex == this.state.selectedTile.x && +yIndex == this.state.selectedTile.y ? " selected" : "")
                paths.push(
                    <TileView
                        id={"x" + xIndex + "y" + yIndex}
                        tile={tiles[xIndex][yIndex]}
                        onClick={this.handleTileClick.bind(this)}
                        className={classNameStart + classNameSelected}
                        path={path}
                        key={xIndex + "_" + yIndex}
                        x={xIndex}
                        y={yIndex}
                        width={this.tileWidth}
                        height={this.tileHeight}
                        showGrid={this.state.showGrid}>
                    </TileView>
                )
            })
        })
        Object.keys(adjacents).map(xIndex => {
            Object.keys(adjacents[+xIndex]).map(yIndex => {
                var path = this.getTilePath(+xIndex, +yIndex, boardSize.widthMin, boardSize.heightMin)
                var classNameStart = (+xIndex == 0 && +yIndex == 0 ? "start" : "")
                paths.push(
                    <TileView
                        tile={adjacents[xIndex][yIndex]}
                        onClick={this.handleAdjacentTileClick.bind(this)}
                        className={"tile adjacent" + classNameStart}
                        path={path}
                        key={"a" + xIndex + "_" + yIndex}
                        x={xIndex}
                        y={yIndex}
                        width={this.tileWidth}
                        height={this.tileHeight}
                        showGrid={this.state.showGrid}>
                    </TileView>
                )
            })
        })

        var svgTranslate = this.state.scrollX && this.state.scrollY ? ("translate(" + this.state.scrollX + "px," + this.state.scrollY + "px) ") : ""
        var svgTransform: string = svgTranslate

        var boardPerspective = (400 + 600 * 1/this.state.zoom) + "px"

        var boardZoom = "scale(" + this.state.zoom + ") "
        var boardCenter = "translate(-50%, -50%)"
        var boardRotate = " rotateX(40deg)"
        var boardTransform = boardZoom + boardCenter + boardRotate

        return (
            <div id="view-board" className="view">
                <Button text="Main Menu" id="board-main-menu-button" onClick={this.handleMenuClick.bind(this)}></Button>
                <Button text="Reset Zoom" id="board-reset-zoom-button" onClick={this.handleResetZoomClick.bind(this)}></Button>
                <Button text="Reset Board Position" id="board-reset-position-button" onClick={this.handleCenterBoardClick.bind(this)}></Button>
                <Button text="Toggle Grid" id="board-toggle-grid" onClick={this.handleToggleGrid.bind(this)}></Button>
                <Button text="Start Game" id="board-start-game" onClick={this.handleStartGame.bind(this)}></Button>
                <div
                    id="board"
                    style={{perspective: boardPerspective}}
                    onMouseDown={this.startDrag.bind(this)}
                    onMouseMove={this.handleDrag.bind(this)}
                    onMouseUp={this.endDrag.bind(this)}
                    onWheel={this.handleOnWheel.bind(this)}>
                    <div id="board-center" style={{transform: boardTransform}}>
                        <svg
                            id="board-svg"
                            width={boardSize.widthMin + boardSize.widthMax}
                            height={boardSize.heightMin + boardSize.heightMax}
                            style={{transform: svgTransform}}>
                            <g id="board-g">
                                {paths.map(path =>
                                    path
                                )}
                                <use
                                    xlinkHref={"#x" + selectedTileX + "y" + selectedTileY}
                                    style={{pointerEvents: "none"}}
                                    onClick={this.handleTileClick.bind(this)}
                                    data-x={selectedTileX}
                                    data-y={selectedTileY}/>
                            </g>
                        </svg>
                        <div id="entities">
                            {this.props.entities.map((entity, index) =>
                                {/* add entities to the board */}
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export class TileView extends React.Component<{
        tile: Tile,
        id?: string,
        onClick?: (e: React.MouseEvent | React.TouchEvent)=>void,
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
        width: number,
        showGrid: boolean
    }, {
    }> {
    
    constructor() {
        super()
    }

    // componentDidMount () {
    //     var path = (this.refs as any).path
    //     if(path) {
    //         var pathLength = path.getTotalLength()
    //         path.style = "stroke-dasharray: " + (pathLength / 500) + "em"
    //     }
    // }

    handlePathClick (e: React.MouseEvent | React.TouchEvent) {
        if(this.props.onClick instanceof Function) {
            this.props.onClick(e)
        }
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

        var className = "tile" + (this.props.className ? " " + this.props.className : "") + (this.props.showGrid ? " tile-grid" : "")

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
                    id={this.props.id}
                    ref="path"
                    onClick={this.handlePathClick.bind(this)}
                    className={className}
                    d={d}
                    data-x={this.props.x}
                    data-y={this.props.y}>
                </path>
            </g>
        )
    }
}