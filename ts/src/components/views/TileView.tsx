/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import {TileModel} from "../models/TileModel"
import {EventBus, TileClickEvent} from "../managers/GameManager"

export class TileView extends React.Component<{
        tile: TileModel,
        id?: string,
        className?: string,
        path: {
            top: {x: number, y: number},
            topRight: {x: number, y: number},
            bottomRight: {x: number, y: number},
            bottom: {x: number, y: number},
            bottomleft: {x: number, y: number},
            topLeft: {x: number, y: number}
        },
        height: number,
        width: number,
        showGrid: boolean
    }, {
    }> {
    
    constructor() {
        super()
    }

    handlePathClick (e: React.MouseEvent | React.TouchEvent) {
        var tileClickEvent = new TileClickEvent(this.props.tile)
        EventBus.notify(tileClickEvent)
    }

    render() {
        var img: any
        if (this.props.tile && this.props.tile.type) {
            // img = require('../../../assets/images/grass0.png')
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
                    data-x={this.props.tile.x}
                    data-y={this.props.tile.y}>
                </path>
            </g>
        )
    }
}