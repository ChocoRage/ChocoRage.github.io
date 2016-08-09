/// <reference path="../../typings/index.d.ts" />
import * as React from "react";
import {MainMenu} from "./views/MainMenu";
import {View} from "./models/View"

export class App extends React.Component<{
    }, {
        view: View
    }> {

    constructor(props: any) {
        super(props)
        
        this.state = {
            view: new View(MainMenu)
        }
    }

    changeView(newView: View) {
        this.setState({
            view: newView
        })
    }

    render() {
        var View = this.state.view.view
        return  (
            <div id="app-container">
                <div id="view-container">
                    <View changeView={this.changeView.bind(this)}></View>
                </div>
            </div>
        )
    }
}