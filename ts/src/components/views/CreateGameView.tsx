import * as React from "react"
import {Button, TextInput} from "./UI"
import {Player, PlayerModel} from "../models/PlayerModel"
import * as GM from "../managers/GameManager"

export class CreateGameModalView extends React.Component<{
        open: boolean,
        playerModel: PlayerModel
    },{
        nameInput: string,
        colorInput: string
    }> {

    constructor(props: any) {
        super(props)
        this.state = {
            nameInput: null,
            colorInput: null
        }
    }

    handleCreateGameFormSubmit = (e: any) => {
        // TODO make color chooser
        // TODO make option to add multiple players
        var color = "ff8800"
        var name = this.state.nameInput
        var createGameFormSubmitEvent = new GM.CreateGameFormSubmitted(this.props.playerModel, [{name: name, color: color}])
        GM.GameManager.createGameFormSubmitted(createGameFormSubmitEvent)
        e.preventDefault()
    }

    handleNameInputChange = (e: any) => {
        this.state.nameInput = e.currentTarget.value
    }

    render() {
        return (
            <div id="create-player-screen" className="modal">
                <form action="" onSubmit={this.handleCreateGameFormSubmit.bind(this)} id="create-player-form" className="form form-modal">
                    <TextInput id="player-name-input" onChange={this.handleNameInputChange.bind(this)}></TextInput>
                    <Button text="Start!" id="create-player-form-submit-button"></Button>
                </form>
            </div>
        )
    }
}