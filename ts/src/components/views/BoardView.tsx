import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button} from "./UI"
import {MainMenuView} from "./MainMenuView"
import {BoardModel} from "../models/BoardModel"
import {TileModel, TileType} from "../models/TileModel"
import {Entity, EntityModel} from "../models/EntityModel"
import {BoardManager} from "../managers/BoardManager"
import {App} from "../App"
import {TileView} from "./TileView"
import {PlayerModel} from "../models/PlayerModel"
import {EntityView} from "../views/EntityView"
import * as GM from "../managers/GameManager"

export class BoardView extends React.Component<{
        boardModel: BoardModel,
        tileHeight: number,
        tileWidth: number,
        tileSpacing: number,
        entityModel: EntityModel,
        playerModel: PlayerModel,
        activePlayerId: number
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

    componentWillReceiveProps(nextProps: {board: BoardModel, entities: Entity[]}) {
        
    }

    componentWillMount() {
        this.centerBoard()
        GM.EventBus.subscribe(this.handleTileAddedEvent)
        GM.EventBus.subscribe(this.setSelectedTile)
    }

    componentDidMount() {
        var entities = document.querySelectorAll(".entity")
        for(var i = 0; i < entities.length; i++) {
            var x = entities[i].children[0].getAttribute("data-x")
            var y = entities[i].children[0].getAttribute("data-y")
            var tile = document.querySelector("[data-x='" + x + "'][data-x='" + y + "']");
            var top = tile.getBoundingClientRect().top
            var left = tile.getBoundingClientRect().left;
            var height = tile.getBoundingClientRect().height;
            var width = tile.getBoundingClientRect().width;
            (entities[i] as any).style.transform = "translate(" + (top - height/2) + "px, " + (left + width/2) + "px)";
        }

    }

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
        var bounds = BoardManager.getBounds(this.props.boardModel.unexplored)
        this.state.scrollX = -this.getBoardPxSize(bounds).widthMin
        this.state.scrollY = -this.getBoardPxSize(bounds).heightMin - this.props.tileHeight / 2
        this.setState(this.state)
    }

    handleMenuClick = () => {
    }

    setSelectedTile = (event: GM.ExploredTileClickedEvent) => {
        if(!this.state.selectedTile || this.state.selectedTile.x != +event.target.x || this.state.selectedTile.y != +event.target.y) {
            this.state.selectedTile = {x: +event.target.x, y: +event.target.y}
        } else {
            this.state.selectedTile = null
        }
    }

    handleExploredTileClicked = (tile: TileModel) => {
        if(this.state.dragging) {
            return
        }
        var tileClickEvent = new GM.ExploredTileClickedEvent(this.props.activePlayerId, tile, this.props.boardModel)
        GM.GameManager.exploredTileClicked(tileClickEvent)
    }

    handleUnexploredTileClick = (tile: TileModel) => {
        if(this.state.dragging) {
            return
        }
        var tileClickEvent = new GM.UnexploredTileClickedEvent(this.props.activePlayerId, tile, this.props.boardModel)
        GM.GameManager.unexploredTileClicked(tileClickEvent)
    }

    handleTileAddedEvent = (event: GM.TileAddedEvent) => {
        if(!(event instanceof GM.TileAddedEvent)) {
            return
        }
        var boundsBefore = this.getBoardPxSize(event.boundsBefore)

        var x = event.target.x
        var y = event.target.y

        var boundsAfter = this.getBoardPxSize(BoardManager.getBounds(this.props.boardModel.unexplored))

        if(boundsAfter.widthMin > boundsBefore.widthMin) {
            this.state.scrollX = this.state.scrollX - Math.abs(boundsAfter.widthMin - boundsBefore.widthMin)
        }
        if(boundsAfter.heightMin > boundsBefore.heightMin) {
            this.state.scrollY = this.state.scrollY - Math.abs(boundsAfter.heightMin - boundsBefore.heightMin)
        }

        this.setState(this.state)
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
        window.setTimeout(
            () => {
                this.state.dragging = false
                this.setState(this.state)
            }, 0
        )
    }

    handleCenterBoardButtonClick = () => {
        this.centerBoard()
    }

    handleResetZoomButtonClicked = () => {
        this.state.zoom = 1
        this.setState(this.state)
    }

    handleToggleGridButtonClicked = () => {
        this.state.showGrid = !this.state.showGrid
        this.setState(this.state)
    }

    handleEndTurnButtonClicked = () => {
        var endTurnButtonClickedEvent = new GM.EndTurnButtonClickedEvent(this.props.activePlayerId)
        GM.GameManager.endTurnButtonClicked(endTurnButtonClickedEvent)
    }

    render() {
        var tiles = this.props.boardModel.tiles
        var unexplored = this.props.boardModel.unexplored
        var entities = this.props.entityModel.entities
        var paths: any[] = []
        var entitySvgs: any[] = []
        var boardSize = this.getBoardPxSize(BoardManager.getBounds(this.props.boardModel.unexplored))
        
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
                        onClick={this.handleExploredTileClicked}
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
                        className={"tile unexplored" + classNameStart}
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
        Object.keys(entities).map((playerId, index) => {
            entities[+playerId].map((entity, index) => {
                entitySvgs.push(
                    <EntityView
                        entity={entity}
                        height={this.props.tileHeight}
                        width={this.props.tileWidth}
                        key={index}
                        x={entity.position.x}
                        y={entity.position.y}>
                    </EntityView>
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
                <div id="board-buttons">
                    <Button text="Main Menu" id="board-main-menu-button" onClick={this.handleMenuClick.bind(this)}></Button>
                    <Button text="Reset Zoom" id="board-reset-zoom-button" onClick={this.handleResetZoomButtonClicked.bind(this)}></Button>
                    <Button text="Reset Board Position" id="board-reset-position-button" onClick={this.handleCenterBoardButtonClick.bind(this)}></Button>
                    <Button text="Toggle Grid" id="board-toggle-grid-button" onClick={this.handleToggleGridButtonClicked.bind(this)}></Button>
                    <Button text="End Turn" id="board-end-turn-button" onClick={this.handleEndTurnButtonClicked.bind(this)}></Button>
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
                                    onClick={this.handleExploredTileClicked.bind(this)}
                                    data-x={selectedTileX}
                                    data-y={selectedTileY}/>
                            </g>
                        </svg>
                    </div>
                    <div id="entities">
                        <svg
                            id="entities-svg">
                            <g id="entities-g">
                                {entitySvgs.map(svg =>
                                    svg
                                )}
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        )
    }
}
