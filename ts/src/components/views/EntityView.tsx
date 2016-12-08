import * as React from "react"
import {Entity} from "../models/EntityModel"

export class EntityView extends React.Component<{
        entity: Entity,
        className?: string,
        classNameImage?: string,
        id: number,
        height: number,
        width: number,
        x: string,
        y: string,
        style: {g: {[cssProperty: string]: string}, image: {[cssProperty: string]: string}}
    },{

    }> {
    


    render() {
        var img: any
        if (this.props.entity && this.props.entity.skinUrl) {
            img = require('../../../assets/images/' + this.props.entity.skinUrl + ".png")
        }

        return (
            <g
                className={"entity" + (this.props.className ? " " + this.props.className : "")}
                id={"en-g-" + this.props.id}
                style={this.props.style.g}>
                <image
                    id={"en-image-" + this.props.id}
                    className={"entity-image" + (this.props.classNameImage ? " " + this.props.classNameImage : "")}
                    xlinkHref={img}
                    height={this.props.height}
                    width={this.props.width}
                    data-x={this.props.x}
                    data-y={this.props.y}
                    style={this.props.style.image}>
                </image>
            </g>
        )
    }
} 