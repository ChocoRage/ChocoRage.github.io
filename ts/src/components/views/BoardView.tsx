import * as React from "react";
import * as ReactDOM from "react-dom";
import * as BABYLON from "babylonjs"
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
    }> {

        
    static dragging = false
    static currentDragPosition = null

    constructor() {
        super()
        
        this.state = {
        }
    }

    componentDidMount() {
        var canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
        var engine = new BABYLON.Engine(canvas, true);

        var createScene = function(){
            var scene = new BABYLON.Scene(engine);
            var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5,-10), scene);
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.attachControl(canvas, false);

            // create a basic light, aiming 0,1,0 - meaning, to the sky
            var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

            // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
            var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

            // move the sphere upward 1/2 of its height
            sphere.position.y = 1;

            // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
            var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

            return scene;
        }

        var scene = createScene();


        scene.onPointerDown = function(evt, pickResult) {
            BoardView.dragging = true
            BoardView.currentDragPosition = pickResult.pickedPoint
            console.log(BoardView.currentDragPosition)
        }

        scene.onPointerUp = function(evt, pickResult) {
            BoardView.dragging = false
        }

        scene.onPointerMove = function(evt, pickResult) {
            if(BoardView.dragging) {
                var delta = BoardView.currentDragPosition.subtract(pickResult.pickedPoint)
                scene.getCameraByName("camera1").position = scene.getCameraByName("camera1").position.add(delta)
                BoardView.currentDragPosition = pickResult.pickedPoint
            }
        }
        
        engine.runRenderLoop(function(){
            // scene.getCameraByName("camera1").position = scene.getCameraByName("camera1").position.add(new BABYLON.Vector3(1, 0, 0))
            scene.render();
        });

        window.addEventListener('resize', function(){
            engine.resize();
        });
    }

    render() {
        
        return (
            <div id="view-board" className="view">
                <canvas id="renderCanvas"></canvas>
            </div>
        )
    }
}
