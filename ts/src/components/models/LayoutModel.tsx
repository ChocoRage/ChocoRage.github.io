import * as React from "react";

export interface LayoutModel {
    getLayout(): any
}

export class MainMenuLayout implements LayoutModel {
    getLayout() {
        return (
            <div id="main-menu-layout">
            </div>
        )
    }
}