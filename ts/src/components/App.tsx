/// <reference path="../../typings/index.d.ts" />
import * as React from "react"
import {MainMenu} from "./views/MainMenu"
import {BoardView} from "./views/BoardView"
import {View} from "./models/View"
import {GameModel} from "./models/GameModel"
import {BoardModel} from "./models/BoardModel"
import {EntityModel} from "./models/EntityModel"

export class App extends React.Component<{
    }, {
        currentView: View,
        boardModel: BoardModel,
        entityModel: EntityModel
    }> {

    static gameModel: GameModel
    static boardModel: BoardModel
    static entityModel: EntityModel


    static tileHeight = 300
    static cos30deg = Math.cos(Math.PI/6)
    static tileWidth = Math.ceil(App.cos30deg * App.tileHeight)
    static tileSpacing = 0

    constructor(props: any) {
        super(props)

        App.gameModel = new GameModel()
        App.boardModel = new BoardModel()
        App.entityModel = new EntityModel()

        this.state = {
            currentView: new View(BoardView),
            boardModel: App.boardModel,
            entityModel: App.entityModel
        }
    }

    changeView(newView: View) {
        this.setState({
            currentView: newView,
            boardModel: App.boardModel,
            entityModel: App.entityModel
        })
    }

    render() {
        var View = this.state.currentView.view
        return  (
            <div id="app-container">
                <div id="view-container">
                    <View changeView={this.changeView.bind(this)} board={App.boardModel} entities={App.entityModel.entities}></View>
                </div>
            </div>
        )
    }
}