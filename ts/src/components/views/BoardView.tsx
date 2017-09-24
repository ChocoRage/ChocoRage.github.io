import * as React from "react";

import {EventBus, TileAddedEvent, AddTileEvent} from "../managers/GameManager"
import {BoardManager} from "../managers/BoardManager"
import {Tile, TileType} from "../models/TileModel"
import {ResourceType} from "../models/ResourceModel"
import {GameStateModel, GameState} from "../models/GameModel"
import {TileView} from "./TileView"
import {Button} from "./UI"

export class BoardView extends React.Component<{
        gameStateModel: GameStateModel,
        tileHeight: number,
        tileWidth: number,
        tileSpacing: number,
        tiles: {[x: string]: {[y: string]: Tile}},
        unexplored: {[x: string]: {[y: string]: Tile}},
        tileTypes: TileType[],
        resourceTypes: ResourceType[]
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
        var pxBoundsBefore = BoardManager.getBoardPxSize(event.boundsBefore, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing)
        var pxBoundsAfter = BoardManager.getBoardPxSize(event.boundsAfter, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing)

        if(pxBoundsAfter.widthMin > pxBoundsBefore.widthMin) {
            this.state.scrollX = this.state.scrollX - Math.abs(pxBoundsAfter.widthMin - pxBoundsBefore.widthMin)
        }
        if(pxBoundsAfter.heightMin > pxBoundsBefore.heightMin) {
            this.state.scrollY = this.state.scrollY - Math.abs(pxBoundsAfter.heightMin - pxBoundsBefore.heightMin)
        }

        this.setState(this.state)
    }
/* =================================================================================================================================== */

    centerBoard = () => {
        var bounds = BoardManager.getBounds(this.props.unexplored)
        this.state.scrollX = -BoardManager.getBoardPxSize(bounds, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing).widthMin
        this.state.scrollY = -BoardManager.getBoardPxSize(bounds, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing).heightMin - this.props.tileHeight / 2
        this.setState(this.state)
    }

    handleUnexploredTileClick = (tile: Tile) => {
        if(this.state.dragging || !this.state.tileMode) {
            return
        }
        if(this.props.gameStateModel.gameState == GameState.GamePaused) {
            return
        }
        tile.type = this.state.tileMode
        var tileClickEvent = new AddTileEvent(tile)
        EventBus.event(tileClickEvent)
    }

    handleTileClick = (tile: Tile) => {
        if(this.state.dragging) {
            return
        }
        if(!this.state.selectedTile || this.state.selectedTile.x != +tile.x || this.state.selectedTile.y != +tile.y) {
            this.state.selectedTile = {x: +tile.x, y: +tile.y}
        } else {
            this.state.selectedTile = null
        }
    }

    handleOnWheel = (e: React.WheelEvent) => {
        var sign = e.deltaY / Math.abs(e.deltaY)
        this.state.zoom = Math.max(0.2, Math.min(this.state.zoom - (sign * 0.1), 1.5))
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
        if(this.props.gameStateModel.gameState == GameState.GamePaused) {
            return
        }
        this.state.tileMode = this.state.tileMode == tileType ? null : tileType
        this.setState(this.state)
    }

    handleEscKeyPressed = () => {
        if(this.props.gameStateModel.gameState == GameState.GamePaused) {
            return
        }
        this.state.tileMode = null;
        this.setState(this.state)
    }

    render() {
        var tiles = this.props.tiles
        var unexplored = this.props.unexplored
        var paths: any[] = []
        var boardSize = BoardManager.getBoardPxSize(BoardManager.getBounds(this.props.unexplored), this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing)
        
        var selectedTileX = ""
        var selectedTileY = ""
        if(this.state.selectedTile) {
            selectedTileX = "" + this.state.selectedTile.x
            selectedTileY = "" + this.state.selectedTile.y
        }

        Object.keys(tiles).map(xIndex => {
            Object.keys(tiles[+xIndex]).map(yIndex => {
                var path = BoardManager.getTileVerticesPositions(+xIndex, +yIndex, boardSize.widthMin, boardSize.heightMin, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing)
                var classNameStart = (+xIndex == 0 && +yIndex == 0 ? "start" : "")
                var classNameSelected = (this.state.selectedTile && +xIndex == this.state.selectedTile.x && +yIndex == this.state.selectedTile.y ? " selected" : "")
                paths.push(
                    <TileView
                        id={"x" + xIndex + "y" + yIndex}
                        tile={tiles[xIndex][yIndex]}
                        className={classNameStart + classNameSelected}
                        path={path}
                        onClick={this.handleTileClick}
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
                var path = BoardManager.getTileVerticesPositions(+xIndex, +yIndex, boardSize.widthMin, boardSize.heightMin, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing)
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

        var tileButtons = this.props.tileTypes ? this.props.tileTypes.map((tileType, index) => {
            var color = "rgba(" + tileType.color.r + "," + tileType.color.g + "," + tileType.color.b + "," + tileType.color.a + ")"
            var badgeText: string[] = []
            tileType.cost.map(tileResourceCost => {
                if(tileResourceCost.amount > 0) {
                    badgeText.push("" + tileResourceCost.amount + tileResourceCost.resourceType.icon)
                }
            })
            var tileHeight = 70
            var tileWidth = (Math.ceil(Math.cos(Math.PI/6) * tileHeight))
            var d = BoardManager.getTilePathD(BoardManager.getTileVerticesPositions(0,0,tileWidth/2,0,tileHeight,tileWidth,0))
            var pathProps = {
                fill: color,
                d: d,
                stroke: "#333",
                strokeLinecap: "round",
                strokeWidth: "1"
            }
            return (
                <Button
                    text=""
                    className="button button-svg"
                    id={"board-button-" + tileType.name}
                    onClick={this.handleCreateTileButtonClicked.bind(this, tileType)}
                    active={this.state.tileMode == tileType}
                    key={index}
                    badgeText={badgeText}
                    style={{height: tileHeight, width: tileWidth}}
                    pathProps={pathProps}>
                </Button>
            )
        }) : null

        var resources = this.props.resourceTypes ? this.props.resourceTypes.map((resourceType, index) => {
            var amount = this.props.gameStateModel.currentPlayer ? this.props.gameStateModel.currentPlayer.playerResources[resourceType.name].amount : 0
            return (
                <div id={"resource-" + resourceType.name} className="resource" key={index}>
                    <div className="resource-icon">
                        {resourceType.icon}
                    </div>
                    <div className="resource-amount">
                        {amount}
                    </div>
                </div>
            )
        }) : null

        return (
            <div id="view-board" className={"view" + (this.state.tileMode ? " reveal-mode": "")}>
                <div id="game-resources">
                    {resources}
                </div>
                <div id="tile-buttons">
                    {tileButtons}
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
                                    onClick={this.handleTileClick.bind(this)}
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
