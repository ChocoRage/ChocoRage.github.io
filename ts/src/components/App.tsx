import * as React from "react";
import {LayoutModel, MainMenuLayout} from "./models/LayoutModel";
import {Layout} from "./views/Layout";
import {Button} from "./views/UI"

export class App extends React.Component<{}, {
        layout: LayoutModel
    }> {

    constructor(props: any) {
        super(props)
        this.state = {
            layout: new MainMenuLayout()
        }
    }

    handleStartClick = () => {
        alert("ok")
    }

    render() {
        return  (
            <div id="app-container">
                <Layout layout={this.state.layout}>
                    <Button text="Start" onClick={this.handleStartClick.bind(this)}></Button>
                </Layout>
            </div>
        )
    }
}