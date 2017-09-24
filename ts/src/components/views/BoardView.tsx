import * as React from "react";

import {EventBus, TileAddedEvent, AddTileEvent} from "../managers/GameManager"
import {BoardManager} from "../managers/BoardManager"

import {GameState} from "../models/GameModel"
import {BoardModel} from "../models/BoardModel"
import {Tile, TileType} from "../models/TileModel"

import {TileView} from "./TileView"

import {Button} from "./UI"

export class BoardView extends React.Component<{
        tileHeight: number,
        tileWidth: number,
        tileSpacing: number,
        tiles: {[x: string]: {[y: string]: Tile}},
        unexplored: {[x: string]: {[y: string]: Tile}},
        tileTypes: TileType[]
    }, {
        selectedTile: {x: number, y: number},
        zoom: number,
        scrollX: number,
        scrollY: number,
        dragging: boolean,
        dragPosition: {x: number, y: number},
        showGrid: boolean,
        didMount: boolean,
        tileMode: TileType
    }> {
        
    constructor() {
        super()
        
        this.state = {
            selectedTile: null,
            scrollX: 0,
            scrollY: 0,
            zoom: 1,
            dragging: false,
            dragPosition: null,
            showGrid: true,
            didMount: false,
            tileMode: null
        }
    }

    componentWillReceiveProps(nextProps: any) {
    }

    componentWillMount() {
        this.centerBoard()
        EventBus.subscribe(this.handleTileAddedEvent, TileAddedEvent.prototype)
    }

    componentDidMount() {
        if(!this.state.didMount) {
            this.state.didMount = true
            this.setState(this.state)
        }
        window.addEventListener("keydown", (e) => {
            if(e.code == "Escape") {
                this.handleEscKeyPressed()
            }
        })
    }

/* =================================================================================================================================== */
/* ======================== Event Bus Subscriptions ================================================================================== */
/* =================================================================================================================================== */
    handleTileAddedEvent = (event: TileAddedEvent) => {
        if(!(event instanceof TileAddedEvent)) {
            return
        }
        var pxBoundsBefore = this.getBoardPxSize(event.boundsBefore)
        var pxBoundsAfter = this.getBoardPxSize(event.boundsAfter)

        if(pxBoundsAfter.widthMin > pxBoundsBefore.widthMin) {
            this.state.scrollX = this.state.scrollX - Math.abs(pxBoundsAfter.widthMin - pxBoundsBefore.widthMin)
        }
        if(pxBoundsAfter.heightMin > pxBoundsBefore.heightMin) {
            this.state.scrollY = this.state.scrollY - Math.abs(pxBoundsAfter.heightMin - pxBoundsBefore.heightMin)
        }

        this.setState(this.state)
    }
/* =================================================================================================================================== */

    getTilePath = (x: number, y: number, originLeft: number, originTop: number) => {
        var tileHeight = this.props.tileHeight
        var tileWidth = this.props.tileWidth
        var tileSpacing = this.props.tileSpacing

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

    getBoardPxSize = (bounds: {widthMin: number, widthMax: number, heightMin: number, heightMax: number}) => {
        var widthMin = (this.props.tileWidth + this.props.tileSpacing) * (Math.abs(bounds.widthMin) + 1/2)
        var widthMax = (this.props.tileWidth + this.props.tileSpacing) * (Math.abs(bounds.widthMax) + 1/2)

        var heightMin = (this.props.tileHeight + this.props.tileSpacing) * (Math.abs(bounds.heightMin) * 3/4)
        var heightMax = (this.props.tileHeight + this.props.tileSpacing) * (Math.abs(bounds.heightMax) * 3/4 + 1)

        return {
            widthMin: widthMin,
            widthMax: widthMax,
            heightMin: heightMin,
            heightMax: heightMax
        }
    }

    centerBoard = () => {
        var bounds = BoardManager.getBounds(this.props.unexplored)
        this.state.scrollX = -this.getBoardPxSize(bounds).widthMin
        this.state.scrollY = -this.getBoardPxSize(bounds).heightMin - this.props.tileHeight / 2
        this.setState(this.state)
    }

    handleMenuClick = () => {
    }

    handleUnexploredTileClick = (tile: Tile) => {
        if(this.state.dragging || !this.state.tileMode) {
            return
        }
        tile.type = this.state.tileMode
        var tileClickEvent = new AddTileEvent(tile)
        EventBus.event(tileClickEvent)
    }

    setSelectedTile = (tile: Tile) => {
        if(!this.state.selectedTile || this.state.selectedTile.x != +tile.x || this.state.selectedTile.y != +tile.y) {
            this.state.selectedTile = {x: +tile.x, y: +tile.y}
        } else {
            this.state.selectedTile = null
        }
    }

    handleOnWheel = (e: React.WheelEvent) => {
        var sign = e.deltaY / Math.abs(e.deltaY)
        this.state.zoom = Math.max(0.2, Math.min(this.state.zoom - (sign * 0.1), 2.5))
        this.setState(this.state)
    }

    startDrag = (e: React.MouseEvent) => {
        this.state.dragPosition = {x: e.clientX, y: e.clientY}
    }

    handleDrag = (e: React.MouseEvent) => {
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

    endDrag = (e: React.MouseEvent) => {
        this.state.dragPosition = null
        window.setTimeout(() => {
            this.state.dragging = false
            this.setState(this.state)
        }, 0)
    }

    // handleCenterBoardButtonClick = () => {
    //     this.centerBoard()
    // }

    // handleResetZoomButtonClicked = () => {
    //     this.state.zoom = 1
    //     this.setState(this.state)
    // }

    // handleToggleGridButtonClicked = () => {
    //     this.state.showGrid = !this.state.showGrid
    //     this.setState(this.state)
    // }

    handleCreateTileButtonClicked = (tileType) => {
        this.state.tileMode = tileType
        this.setState(this.state)
    }

    handleEscKeyPressed = () => {
        this.state.tileMode = null;
        this.setState(this.state)
    }

    render() {
        var tiles = this.props.tiles
        var unexplored = this.props.unexplored
        var paths: any[] = []
        var boardSize = this.getBoardPxSize(BoardManager.getBounds(this.props.unexplored))
        
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
                        className={classNameStart + classNameSelected}
                        path={path}
                        onClick={this.setSelectedTile}
                        height={this.props.tileHeight}
                        width={this.props.tileWidth}
                        key={xIndex + "_" + yIndex}
                        showGrid={this.state.showGrid}>
                    </TileView>
                )
            })
        })
        Object.keys(unexplored).map(xIndex => {
            Object.keys(unexplored[+xIndex]).map(yIndex => {
                var path = this.getTilePath(+xIndex, +yIndex, boardSize.widthMin, boardSize.heightMin)
                var classNameStart = (+xIndex == 0 && +yIndex == 0 ? "start" : "")
                paths.push(
                    <TileView
                        tile={unexplored[xIndex][yIndex]}
                        className={"tile unexplored" + classNameStart + (this.state.tileMode ? " reveal-mode": "")}
                        path={path}
                        onClick={this.handleUnexploredTileClick}
                        height={this.props.tileHeight}
                        width={this.props.tileWidth}
                        key={"a" + xIndex + "_" + yIndex}
                        showGrid={this.state.showGrid}>
                    </TileView>
                )
            })
        })

        var svgTranslate = this.state.scrollX && this.state.scrollY ? ("translate(" + (this.state.scrollX).toString() + "px," + (this.state.scrollY).toString() + "px) ") : ""
        var svgTransform: string = svgTranslate

        var boardPerspective = (400 + 600 * 1/this.state.zoom) + "px"

        var boardZoom = "scale(" + this.state.zoom + ") "
        var boardCenter = "translate(-50%, -50%)"
        var boardRotate = " rotateX(30deg)"
        var boardTransform = boardZoom + boardCenter + boardRotate

        var buttons = this.props.tileTypes ? this.props.tileTypes.map((tileType, index) => {
            var color = "rgba(" + tileType.color.r + "," + tileType.color.g + "," + tileType.color.b + "," + tileType.color.a + ")"
            return (
                <Button
                    text=""
                    id={"board-reveal-button-" + tileType.name}
                    onClick={this.handleCreateTileButtonClicked.bind(this, tileType)}
                    active={this.state.tileMode == tileType}
                    style={{backgroundColor: color}}
                    key={index}>
                </Button>
            )
        }) : null

        return (
            <div id="view-board" className={"view" + (this.state.tileMode ? " reveal-mode": "")}>
                {/*<div id="board-buttons">
                    <Button text="Main Menu" id="board-main-menu-button" onClick={this.handleMenuClick.bind(this)}></Button>
                    <Button text="Reset Zoom" id="board-reset-zoom-button" onClick={this.handleResetZoomButtonClicked.bind(this)}></Button>
                    <Button text="Reset Board Position" id="board-reset-position-button" onClick={this.handleCenterBoardButtonClick.bind(this)}></Button>
                    <Button text="Toggle Grid" id="board-toggle-grid-button" onClick={this.handleToggleGridButtonClicked.bind(this)}></Button>
                </div>*/}
                <div id="game-buttons">
                    {buttons}
                </div>
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
                                    onClick={this.setSelectedTile.bind(this)}
                                    data-x={selectedTileX}
                                    data-y={selectedTileY}/>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        )
    }
}
