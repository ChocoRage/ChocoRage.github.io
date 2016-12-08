import * as React from "react"
import {Button, TextInput} from "./UI"
import {Player, PlayerModel} from "../models/PlayerModel"
import {EntityModel} from "../models/EntityModel"
import * as GM from "../managers/GameManager"

export class CreateGameModalView extends React.Component<{
        open: boolean,
        playerModel: PlayerModel,
        entityModel: EntityModel
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

    handleStartGameButtonClicked = (e: any) => {
        // TODO make color chooser
        // TODO make option to add multiple players
        var color = "ff8800"
        var name = this.state.nameInput
        var createStartGameButtonClickEvent = new GM.StartGameButtonClickedEvent(this.props.playerModel, this.props.entityModel, [{name: name, color: color}])
        GM.GameManager.startGameButtonClicked(createStartGameButtonClickEvent)
        e.preventDefault()
    }

    handleNameInputChange = (e: any) => {
        this.state.nameInput = e.currentTarget.value
    }

    render() {
        return (
            <div id="create-player-screen" className="modal">
                <form action="" onSubmit={this.handleStartGameButtonClicked.bind(this)} id="create-player-form" className="form form-modal">
                    <TextInput id="player-name-input" onChange={this.handleNameInputChange.bind(this)}></TextInput>
                    <Button text="Start!" id="start-game-button"></Button>
                </form>
            </div>
        )
    }
}