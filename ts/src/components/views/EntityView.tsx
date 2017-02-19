import * as React from "react"
import {Entity} from "../models/EntityModel"

export class EntityView extends React.Component<{
        entity: Entity,
        className?: string,
        classNameImage?: string,
        id: number,
        defaultHeight: number,
        defaultWidth: number,
        x: string,
        y: string,
        style: {div: {[cssProperty: string]: string}, g: {[cssProperty: string]: string}, image: {[cssProperty: string]: string}, scale: number}
    },{
        svgHeight: number,
        svgWidth: number
    }> {

    constructor(props: any) {
        super(props)
        this.state = {svgWidth: this.props.defaultHeight * this.props.style.scale, svgHeight: this.props.defaultWidth * this.props.style.scale}
    }

    componentDidMount() {
        var image = (this.refs as any)["image"]
        var h = image.getBoundingClientRect().height
        var w = image.getBoundingClientRect().width
    }
    
    render() {
        var img: any
        if (this.props.entity && this.props.entity.skinUrl) {
            img = require('../../../assets/images/' + this.props.entity.skinUrl + ".png")
        }

        return (
            <div className="entity-div" style={this.props.style.div}>
                <svg height={this.state.svgHeight} width={this.state.svgWidth}>
                    <g
                        className={"entity" + (this.props.className ? " " + this.props.className : "")}
                        id={"en-g-" + this.props.id}
                        style={this.props.style.g}>
                        <image
                            ref="image"
                            id={"en-image-" + this.props.id}
                            className={"entity-image" + (this.props.classNameImage ? " " + this.props.classNameImage : "")}
                            xlinkHref={img}
                            height={this.props.defaultHeight * this.props.style.scale}
                            width={this.props.defaultWidth * this.props.style.scale}
                            data-x={this.props.x}
                            data-y={this.props.y}
                            style={this.props.style.image}>
                        </image>
                    </g>
                </svg>
            </div>
        )
    }
} 