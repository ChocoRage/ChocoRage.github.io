/// <reference path="../../../typings/index.d.ts" />
declare var require: any
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button} from "./UI"
import {View} from "../models/ViewModel"
import {MainMenu} from "./MainMenu"
import {BoardModel} from "../models/BoardModel"
import {TileModel, TileType} from "../models/TileModel"
import {Entity} from "../models/EntityModel"
import {BoardManager} from "../managers/BoardManager"
import {TileTypes} from "../managers/TileManager"
import {App} from "../App"
import {TileView} from "./TileView"
import {EventBus, TileAddedEvent, BoardTileClickEvent, AdjacentTileClickEvent} from "../managers/GameManager"

export class BoardView extends React.Component<{
        changeView: (newVew: View)=>void,
        board: BoardModel,
        tileHeight: number,
        tileWidth: number,
        tileSpacing: number,
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

    constructor() {
        super()
        
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

    componentWillReceiveProps(nextProps: {changeView: (newVew: View)=>void, board: BoardModel, entities: Entity[]}) {
        
    }

    componentWillMount () {
        this.centerBoard()
        EventBus.subscribe(this.adjustBoardAfterTileAdded)
        EventBus.subscribe(this.setSelectedTile)
    }

    getTilePath(x: number, y: number, originLeft: number, originTop: number) {
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

    getBoardPxSize(bounds: {widthMin: number, widthMax: number, heightMin: number, heightMax: number}) {
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

    centerBoard () {
        var bounds = BoardManager.getBounds(this.props.board.adjacents)
        this.state.scrollX = -this.getBoardPxSize(bounds).widthMin
        this.state.scrollY = -this.getBoardPxSize(bounds).heightMin - this.props.tileHeight / 2
        this.setState(this.state)
    }

    handleMenuClick() {
        {this.props.changeView(new View(MainMenu))}
    }

    setSelectedTile = (event: BoardTileClickEvent) => {
        if(!this.state.selectedTile || this.state.selectedTile.x != +event.target.x || this.state.selectedTile.y != +event.target.y) {
            this.state.selectedTile = {x: +event.target.x, y: +event.target.y}
        } else {
            this.state.selectedTile = null
        }
    }

    handleBoardTileClick = (tile: TileModel) => {
        if(this.state.dragging) {
            return
        }
        var tileClickEvent = new BoardTileClickEvent(tile)
        EventBus.notify(tileClickEvent)
    }

    handleAdjacentTileClick = (tile: TileModel) => {
        if(this.state.dragging) {
            return
        }
        var tileClickEvent = new AdjacentTileClickEvent(tile)
        EventBus.notify(tileClickEvent)
    }

    adjustBoardAfterTileAdded = (event: TileAddedEvent) => {
        if(!(event instanceof TileAddedEvent)) {
            return
        }
        var boundsBefore = this.getBoardPxSize(event.boundsBefore)

        var x = event.target.x
        var y = event.target.y

        var boundsAfter = this.getBoardPxSize(this.props.board.getBounds())

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
        var boardSize = this.getBoardPxSize(BoardManager.getBounds(this.props.board.adjacents))
        
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
                        onClick={this.handleBoardTileClick}
                        height={this.props.tileHeight}
                        width={this.props.tileWidth}
                        key={xIndex + "_" + yIndex}
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
                        className={"tile adjacent" + classNameStart}
                        path={path}
                        onClick={this.handleAdjacentTileClick}
                        height={this.props.tileHeight}
                        width={this.props.tileWidth}
                        key={"a" + xIndex + "_" + yIndex}
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
                <Button text="Toggle Grid" id="board-toggle-grid-button" onClick={this.handleToggleGrid.bind(this)}></Button>
                <Button text="Start Game" id="board-start-game-button" onClick={this.handleStartGame.bind(this)}></Button>
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
                                    onClick={this.handleBoardTileClick.bind(this)}
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
