/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import {Button} from "./UI"
import {View} from "../models/View"
import {MainMenu} from "./MainMenu"
import {Board} from "../models/BoardModel"

export class BoardView extends React.Component<{
        changeView: (newVew: View)=>void
    }, {
        board: Board
    }> {
    
    constructor() {
        super()
        this.state = {
            board: new Board(11, 11, 100, 2)
        }
    }

    handleMenuClick = () => {
        {this.props.changeView(new View(MainMenu))}
    }

    handleTileClick(e: any) {
        console.log(e.target)
    }

    render() {
        var tiles = this.state.board.tiles
        return (
            <div id="view-board" className="view">
                <Button text="Main Menu" id="board-main-menu-button" onClick={this.handleMenuClick.bind(this)}></Button>
                <div id="board">
                    <svg id="board-svg" width="100%" height="100%">
                        <g >
                            {tiles.map(tilesX => 
                                tilesX.map(tile =>
                                    <path onClick={this.handleTileClick.bind(this)} className="tile-anchor" d={"M " + tile.path.top.x + "," + tile.path.top.y
                                        + " l " + tile.path.topRight.x + "," + tile.path.topRight.y
                                        + " l " + tile.path.bottomRight.x + "," + tile.path.bottomRight.y
                                        + " l " + tile.path.bottom.x + "," + tile.path.bottom.y
                                        + " l " + tile.path.bottomleft.x + "," + tile.path.bottomleft.y
                                        + " l " + tile.path.topLeft.x + "," + tile.path.topLeft.y}>
                                    </path>
                                )
                            )}
                        </g>
                    </svg>
                </div>
            </div>
        )
    }
}