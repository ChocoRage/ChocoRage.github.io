import * as React from "react"
import {Button, TextInput} from "./UI"
import {Player} from "../models/PlayerModel"
import {AddPlayerEvent} from "../managers/GameManager"

export class CreatePlayerModalView extends React.Component<{
        open: boolean
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

    handleCreatePlayerButtonClicked = (e: any) => {
        // TODO make color chooser
        // TODO make option to add multiple players
        var color = "ff8800"
        var name = this.state.nameInput
        var addPlayerEvent = new AddPlayerEvent(new Player(color, name))
        
        e.preventDefault()
    }

    handleNameInputChange = (e: any) => {
        this.state.nameInput = e.currentTarget.value
    }

    render() {
        return (
            <div id="create-player-screen" className="modal">
                <form action="" onSubmit={this.handleCreatePlayerButtonClicked.bind(this)} id="create-player-form" className="form form-modal">
                    <TextInput id="player-name-input" onChange={this.handleNameInputChange.bind(this)}></TextInput>
                    <Button text="Create Player" id="create-player-button"></Button>
                </form>
            </div>
        )
    }
}