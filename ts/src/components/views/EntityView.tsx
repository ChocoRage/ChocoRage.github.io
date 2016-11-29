import * as React from "react"
import {Entity} from "../models/EntityModel"

export class EntityView extends React.Component<{
        entity: Entity,
        className?: string,
        classNameImage?: string,
        id?: string,
        height: number,
        width: number,
        x: string,
        y: string
    },{

    }> {
    


    render() {
        var img: any
        if (this.props.entity && this.props.entity.skinUrl) {
            img = require('../../../assets/images/' + this.props.entity.skinUrl + ".png")
        }

        return (
            <g className={"entity" + (this.props.className ? " " + this.props.className : "")}>
                <image
                    className={"entity-image" + (this.props.classNameImage ? " " + this.props.classNameImage : "")}
                    xlinkHref={img}
                    height={this.props.height}
                    width={this.props.width}
                    data-x={this.props.x}
                    data-y={this.props.y}>
                </image>
            </g>
        )
    }
} 