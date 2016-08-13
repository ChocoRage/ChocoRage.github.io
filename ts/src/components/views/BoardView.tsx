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
    
    constructor(props) {
        super(props)
        this.state = {
            board: new Board(1, 1, 300, 20)
        }
    }

    handleMenuClick = () => {
        {this.props.changeView(new View(MainMenu))}
    }

    render() {
        var tiles = this.state.board.tiles
        return (
            <div id="view-board" className="view">
                <Button text="Main Menu" onClick={this.handleMenuClick.bind(this)}></Button>
                <div id="board">
                    <svg width="1000" height="600">
                        <g >
                            {tiles.map(tilesX => 
                                tilesX.map(tile =>
                                    <path d={"M " + tile.path.top.x + "," + tile.path.top.y
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