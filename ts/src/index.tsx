"use strict"

import * as React from "react";
import * as ReactDOM from "react-dom";

import {App} from "./components/App";

require("../styles/main.scss")

ReactDOM.render(
    <App />,
    document.getElementById("app")
);