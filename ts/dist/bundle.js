/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(2);
	const ReactDOM = __webpack_require__(3);
	const App_1 = __webpack_require__(4);
	__webpack_require__(22);
	ReactDOM.render(React.createElement(App_1.App, null), document.getElementById("app"));


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = React;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = ReactDOM;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/// <reference path="../../typings/index.d.ts" />
	const React = __webpack_require__(2);
	const BoardView_1 = __webpack_require__(18);
	const PlayerModel_1 = __webpack_require__(13);
	const CreatePlayerView_1 = __webpack_require__(21);
	const GameModel_1 = __webpack_require__(14);
	const GameManager_1 = __webpack_require__(7);
	class App extends React.Component {
	    constructor(props) {
	        super(props);
	        this.tileHeight = 300;
	        this.tileWidth = Math.ceil(Math.cos(Math.PI / 6) * this.tileHeight);
	        this.tileSpacing = 0;
	        /* =================================================================================================================================== */
	        /* ======================== Event Bus Subscriptions ================================================================================== */
	        /* =================================================================================================================================== */
	        this.handleInitEvent = (event) => {
	            if (!(event instanceof GameManager_1.InitEvent)) {
	                return;
	            }
	            this.state.gameStateModel = event.gameState;
	            this.state.tileTypes = event.tileTypes;
	            this.state.resourceTypes = event.resourceTypes;
	            this.setState(this.state);
	        };
	        this.handleCreateGameButtonClickedEvent = (event) => {
	            if (!(event instanceof GameManager_1.CreateGameButtonClickedEvent)) {
	                return;
	            }
	            if (this.state.gameStateModel.gameState == GameModel_1.GameState.GamePaused) {
	                return;
	            }
	            this.state.modalViews.push({ view: CreatePlayerView_1.CreatePlayerModalView, open: true });
	            this.setState(this.state);
	        };
	        this.handlePlayerAddedEvent = (event) => {
	            if (!(event instanceof GameManager_1.PlayerAddedEvent)) {
	                return;
	            }
	            this.state.gameStateModel.playerModel = event.newPlayerModel;
	        };
	        this.handleStartGameEvent = (event) => {
	            if (!(event instanceof GameManager_1.StartGameEvent)) {
	                return;
	            }
	            this.state.modalViews.map((modals, index) => {
	                if (modals.view == CreatePlayerView_1.CreatePlayerModalView) {
	                    this.state.modalViews.splice(index, 1);
	                }
	            });
	            this.state.currentView = BoardView_1.BoardView;
	            this.setState(this.state);
	        };
	        this.handleTileAddedEvent = (event) => {
	            if (!(event instanceof GameManager_1.TileAddedEvent)) {
	                return;
	            }
	            this.state.gameStateModel.boardModel = event.boardModel;
	            this.setState(this.state);
	        };
	        this.state = {
	            gameStateModel: new GameModel_1.GameStateModel(),
	            currentView: BoardView_1.BoardView,
	            modalViews: [],
	            tileTypes: null,
	            resourceTypes: null
	        };
	    }
	    componentDidMount() {
	        GameManager_1.EventBus.subscribe(this.handleCreateGameButtonClickedEvent, GameManager_1.CreateGameButtonClickedEvent.prototype);
	        GameManager_1.EventBus.subscribe(this.handlePlayerAddedEvent, GameManager_1.PlayerAddedEvent.prototype);
	        GameManager_1.EventBus.subscribe(this.handleStartGameEvent, GameManager_1.StartGameEvent.prototype);
	        GameManager_1.EventBus.subscribe(this.handleTileAddedEvent, GameManager_1.TileAddedEvent.prototype);
	        GameManager_1.EventBus.subscribe(this.handleInitEvent, GameManager_1.InitEvent.prototype);
	        /* DELETEME */
	        GameManager_1.EventBus.event(new GameManager_1.InitEvent(null, null, null));
	        GameManager_1.EventBus.event(new GameManager_1.AddPlayerEvent(new PlayerModel_1.Player("#000", "p1")));
	        GameManager_1.EventBus.event(new GameManager_1.StartGameEvent(null));
	    }
	    /* =================================================================================================================================== */
	    render() {
	        if (!this.state.gameStateModel.boardModel) {
	            return null;
	        }
	        var view;
	        switch (this.state.currentView) {
	            case BoardView_1.BoardView:
	            default:
	                view = (React.createElement(BoardView_1.BoardView, { tileHeight: this.tileHeight, tileWidth: this.tileWidth, tileSpacing: this.tileSpacing, tiles: this.state.gameStateModel.boardModel.tiles, unexplored: this.state.gameStateModel.boardModel.unexplored, tileTypes: this.state.tileTypes, resourceTypes: this.state.resourceTypes, gameStateModel: this.state.gameStateModel }));
	                break;
	        }
	        var modalViews;
	        if (this.state.modalViews && this.state.modalViews.length > 0) {
	            modalViews = [];
	            this.state.modalViews.map((modal, index) => {
	                switch (modal.view) {
	                    case CreatePlayerView_1.CreatePlayerModalView:
	                        modalViews.push(React.createElement(CreatePlayerView_1.CreatePlayerModalView, { open: modal.open, key: index }));
	                        break;
	                    default: break;
	                }
	            });
	        }
	        return (React.createElement("div", { id: "app-container" },
	            modalViews,
	            React.createElement("div", { id: "view-container" }, view)));
	    }
	}
	exports.App = App;


/***/ }),
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(2);
	class Button extends React.Component {
	    constructor(props) {
	        super(props);
	        this.handleOnClick = () => {
	            this.props.onClick();
	        };
	    }
	    render() {
	        var onClick = typeof this.props.onClick == "function" ? this.handleOnClick.bind(this) : null;
	        var className = (this.props.className ? this.props.className : "button") + (this.props.active ? " button-active" : "");
	        return (React.createElement("div", { className: "button-container" },
	            this.props.pathProps ?
	                React.createElement("svg", { className: className, style: this.props.style },
	                    React.createElement("path", Object.assign({ onClick: onClick, className: this.props.active ? "button-svg-active" : "" }, this.props.pathProps)))
	                :
	                    React.createElement("button", { id: this.props.id, onClick: onClick, className: className, style: this.props.style },
	                        this.props.text,
	                        this.props.active ?
	                            React.createElement("span", { className: "button-active-indicator" }) : null),
	            this.props.badgeText ?
	                React.createElement("div", { className: "button-badge" }, this.props.badgeText.map((badgeTextLine, index) => React.createElement("div", { className: "button-badge-line", key: index }, badgeTextLine)))
	                : null));
	    }
	}
	exports.Button = Button;
	class TextInput extends React.Component {
	    constructor() {
	        super(...arguments);
	        this.handleOnChange = (e) => {
	            this.props.onChange(e);
	        };
	        this.handleOnBlur = (e) => {
	            this.props.onChange(e);
	        };
	    }
	    render() {
	        return (React.createElement("input", { type: "text", id: this.props.id, value: this.props.value, placeholder: this.props.placeholder, onChange: typeof this.props.onChange == "function" ? this.handleOnChange.bind(this) : null, onBlur: typeof this.props.onBlur == "function" ? this.handleOnBlur.bind(this) : null }));
	    }
	}
	exports.TextInput = TextInput;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const TileModel_1 = __webpack_require__(8);
	const BoardModel_1 = __webpack_require__(9);
	const PlayerModel_1 = __webpack_require__(13);
	const GameModel_1 = __webpack_require__(14);
	const BoardManager_1 = __webpack_require__(10);
	const PlayerManager_1 = __webpack_require__(15);
	const ResourceManager_1 = __webpack_require__(16);
	const Utils_1 = __webpack_require__(17);
	const Database_1 = __webpack_require__(11);
	class GameManager {
	    static handleEvent(event) {
	        console.log(event.constructor.name);
	        this["handle" + event.constructor.name](event);
	    }
	    static handleInitEvent() {
	        GameManager.gameStateModel = new GameModel_1.GameStateModel();
	        GameManager.gameStateModel.boardModel = new BoardModel_1.BoardModel();
	        GameManager.gameStateModel.playerModel = new PlayerModel_1.PlayerModel();
	        GameManager.gameStateModel.gameState = GameModel_1.GameState.GamePaused;
	        var initEvent = new InitEvent(GameManager.gameStateModel, Database_1.tileTypes, Database_1.resourceTypes);
	        EventBusNotifyer.notify(initEvent);
	    }
	    static handleStartGameEvent() {
	        GameManager.gameStateModel.gameState = GameModel_1.GameState.GameRunning;
	        GameManager.gameStateModel.currentPlayer = GameManager.gameStateModel.playerModel.players[0];
	        var gameStartedEvent = new StartGameEvent(GameManager.gameStateModel);
	        EventBusNotifyer.notify(gameStartedEvent);
	    }
	    static handleAddPlayerEvent(event) {
	        var nextPlayerId = PlayerManager_1.PlayerManager.getNextPlayerId(GameManager.gameStateModel.playerModel);
	        event.newPlayer.id = nextPlayerId;
	        event.newPlayer.playerResources = ResourceManager_1.ResourceManager.getInitialPlayerResources();
	        GameManager.gameStateModel.playerModel.players[nextPlayerId] = event.newPlayer;
	        var playerCopy = Utils_1.cloneObject(event.newPlayer);
	        var playerModelCopy = Utils_1.cloneObject(GameManager.gameStateModel.playerModel);
	        var playerAddedEvent = new PlayerAddedEvent(playerCopy, playerModelCopy);
	        EventBusNotifyer.notify(playerAddedEvent);
	    }
	    static createGameButtonClicked(event) {
	        EventBusNotifyer.notify(event);
	    }
	    static handleAddTileEvent(event) {
	        // DELETEME
	        var newTile = new TileModel_1.Tile(event.tile.x, event.tile.y, event.tile.type);
	        var boundsBefore = BoardManager_1.BoardManager.getBounds(GameManager.gameStateModel.boardModel.unexplored);
	        var newBoard = BoardExecutor.addTile(GameManager.gameStateModel.boardModel, newTile);
	        var boundsAfter = BoardManager_1.BoardManager.getBounds(newBoard.unexplored);
	        var tileAddedEvent = new TileAddedEvent(event.triggeringPlayerId, newTile, newBoard, boundsBefore, boundsAfter);
	        EventBusNotifyer.notify(tileAddedEvent);
	    }
	}
	/* =================================================================================================================================== */
	/* ======================== Event Bus ================================================================================================ */
	/* =================================================================================================================================== */
	class EventBusNotifyer {
	    static notify(eventType) {
	        // TODO Make broadcasting more efficient. Create a channel for each event type and only notify listeners who are in that channel.
	        EventBusNotifyer.listeners.map(cb => {
	            cb(eventType);
	        });
	    }
	}
	// the listeners can be property of a manager component because they will never be persisted.
	// every game has to populate the listeners at runtime. loaded games need to go through the event history and execute them serially.
	EventBusNotifyer.listeners = [];
	class EventBus {
	    static subscribe(cb, eventType) {
	        EventBusNotifyer.listeners.push(cb);
	    }
	    static unsubscribe(cb, eventType) {
	        var idx = EventBusNotifyer.listeners.indexOf(cb);
	        EventBusNotifyer.listeners.splice(idx, 1);
	    }
	    static event(event) {
	        GameManager.handleEvent(event);
	    }
	}
	exports.EventBus = EventBus;
	/* =================================================================================================================================== */
	/* ======================== Event Types ============================================================================================== */
	/* =================================================================================================================================== */
	class InitEvent extends GameModel_1.EventType {
	    constructor(gameState, tileTypes, resourceTypes) {
	        super();
	        this.gameState = gameState;
	        this.tileTypes = tileTypes;
	        this.resourceTypes = resourceTypes;
	    }
	}
	exports.InitEvent = InitEvent;
	class AddTileEvent extends GameModel_1.EventType {
	    constructor(target) {
	        super();
	        this.tile = target;
	    }
	}
	exports.AddTileEvent = AddTileEvent;
	class PlayerAddedEvent extends GameModel_1.EventType {
	    constructor(newPlayer, newPlayerModel) {
	        super();
	        this.newPlayer = newPlayer;
	        this.newPlayerModel = newPlayerModel;
	    }
	}
	exports.PlayerAddedEvent = PlayerAddedEvent;
	class TileAddedEvent extends GameModel_1.EventType {
	    constructor(triggeringPlayerId, target, boardModel, boundsBefore, boundsAfter) {
	        super();
	        this.target = target;
	        this.boardModel = boardModel;
	        this.boundsBefore = boundsBefore;
	        this.boundsAfter = boundsAfter;
	    }
	}
	exports.TileAddedEvent = TileAddedEvent;
	class CreateGameButtonClickedEvent extends GameModel_1.EventType {
	    constructor() {
	        super(...arguments);
	        this.isLogged = false;
	    }
	}
	exports.CreateGameButtonClickedEvent = CreateGameButtonClickedEvent;
	class StartGameEvent extends GameModel_1.EventType {
	    constructor(gameStateModel) {
	        super();
	        this.gameStateModel = gameStateModel;
	    }
	}
	exports.StartGameEvent = StartGameEvent;
	class AddPlayerEvent extends GameModel_1.EventType {
	    constructor(newPlayer) {
	        super();
	        this.newPlayer = newPlayer;
	    }
	}
	exports.AddPlayerEvent = AddPlayerEvent;
	/* =================================================================================================================================== */
	/* ======================== Executors ================================================================================================ */
	/* =================================================================================================================================== */
	/* Executors have methods that affect the game, such as the board, or anything else that can be mutated.
	Executors are only visible to the Game Manager to make sure no component other than the Game Manager can call these functions. */
	class BoardExecutor {
	    static addTile(boardModel, tile) {
	        if (boardModel.tiles[tile.x] && boardModel.tiles[tile.x][tile.y]) {
	            console.error("Cannot create new tile: coordinates are taken");
	        }
	        else if (!boardModel.unexplored[tile.x] || !boardModel.unexplored[tile.x][tile.y]) {
	            console.error("Cannot create new tile: coordinates are unreachable");
	        }
	        if (!boardModel.tiles[tile.x]) {
	            boardModel.tiles[tile.x] = {};
	        }
	        delete boardModel.unexplored[tile.x][tile.y];
	        if (Object.keys(boardModel.unexplored[tile.x]).length == 0) {
	            delete boardModel.unexplored[tile.x];
	        }
	        // <REMOVE ME>
	        boardModel.tiles[tile.x][tile.y] = tile;
	        // </REMOVE ME>
	        boardModel.unexplored = this.mergeBoards(boardModel.unexplored, BoardManager_1.BoardManager.getUnexploredAdjacentTiles(boardModel.tiles, tile.x, tile.y));
	        return boardModel;
	    }
	    static mergeBoards(board1, board2) {
	        var result = {};
	        Object.keys(board2).map(xIndex => {
	            Object.keys(board2[+xIndex]).map(yIndex => {
	                if (!result[xIndex]) {
	                    result[xIndex] = {};
	                }
	                result[xIndex][yIndex] = board2[xIndex][yIndex];
	            });
	        });
	        Object.keys(board1).map(xIndex => {
	            Object.keys(board1[+xIndex]).map(yIndex => {
	                if (!result[xIndex]) {
	                    result[xIndex] = {};
	                }
	                result[xIndex][yIndex] = board1[xIndex][yIndex];
	            });
	        });
	        return result;
	    }
	}


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class Tile {
	    constructor(x, y, type, textureVariant) {
	        this.controllingPlayerId = -1;
	        this.x = x;
	        this.y = y;
	        this.type = type;
	        this.textureVariant = textureVariant || (type && type.texture) ? Math.floor(Math.random() * this.type.texture.numberOfVariants + 1) : null;
	    }
	}
	exports.Tile = Tile;
	class TileType {
	    constructor(name, color, cost, description, texture) {
	        this.name = name;
	        this.color = color;
	        this.cost = cost;
	        this.description = description;
	        this.texture = texture;
	    }
	}
	exports.TileType = TileType;
	class TileResourceCost {
	    constructor(resourceType, amount) {
	        this.resourceType = resourceType;
	        this.amount = amount;
	    }
	}
	exports.TileResourceCost = TileResourceCost;
	class Texture {
	}
	exports.Texture = Texture;
	class Color {
	    constructor(r, g, b, a) {
	        this.r = r;
	        this.g = g;
	        this.b = b;
	        this.a = a;
	    }
	}
	exports.Color = Color;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const BoardManager_1 = __webpack_require__(10);
	const TileModel_1 = __webpack_require__(8);
	const Database_1 = __webpack_require__(11);
	class BoardModel {
	    // private bounds: {widthMin: number, widthMax: number, heightMin: number, heightMax: number}
	    constructor(json) {
	        // TODO create tiles from json
	        this.tiles = {
	            "0": {}
	        };
	        // <REMOVE ME>
	        this.tiles["0"]["0"] = new TileModel_1.Tile("0", "0", Database_1.whiteTile);
	        this.unexplored = BoardManager_1.BoardManager.getUnexploredAdjacentTiles(this.tiles, "0", "0");
	        // </REMOVE ME>
	    }
	}
	exports.BoardModel = BoardModel;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const TileModel_1 = __webpack_require__(8);
	class BoardManager {
	    static getBounds(tiles) {
	        var widthMax = 0;
	        var widthMin = 0;
	        var heightMax = 0;
	        var heightMin = 0;
	        Object.keys(tiles).map(xIndex => {
	            Object.keys(tiles[+xIndex]).map(yIndex => {
	                widthMax = Math.max(widthMax, +xIndex + +yIndex / 2);
	                widthMin = Math.min(widthMin, +xIndex + +yIndex / 2);
	                heightMax = Math.max(heightMax, +yIndex);
	                heightMin = Math.min(heightMin, +yIndex);
	            });
	        });
	        return {
	            widthMin: widthMin,
	            widthMax: widthMax,
	            heightMin: heightMin,
	            heightMax: heightMax
	        };
	    }
	    static getUnexploredAdjacentTiles(unexplored, x, y) {
	        var availables = {};
	        if (unexplored && unexplored[x] && unexplored[x][y]) {
	            var xPlusOne = "" + (+x + 1);
	            var xMinusOne = "" + (+x - 1);
	            var yPlusOne = "" + (+y + 1);
	            var yMinusOne = "" + (+y - 1);
	            var xBottomLeft;
	            var xBottomRight;
	            var xTopRight;
	            var xTopLeft;
	            // tile on the right
	            if (!unexplored[xPlusOne] || !unexplored[xPlusOne][y]) {
	                if (!availables[xPlusOne]) {
	                    availables[xPlusOne] = {};
	                }
	                availables[xPlusOne][y] = new TileModel_1.Tile("" + xPlusOne, "" + y, null);
	            }
	            // tile on the bottom right
	            if (!unexplored[x] || !unexplored[x][yPlusOne]) {
	                if (!availables[x]) {
	                    availables[x] = {};
	                }
	                availables[x][yPlusOne] = new TileModel_1.Tile("" + x, "" + yPlusOne, null);
	            }
	            // tile on the bottom left 
	            if (!unexplored[xMinusOne] || !unexplored[xMinusOne][yPlusOne]) {
	                if (!availables[xMinusOne]) {
	                    availables[xMinusOne] = {};
	                }
	                availables[xMinusOne][yPlusOne] = new TileModel_1.Tile("" + xMinusOne, "" + yPlusOne, null);
	            }
	            // tile on the left 
	            if (!unexplored[xMinusOne] || !unexplored[xMinusOne][y]) {
	                if (!availables[xMinusOne]) {
	                    availables[xMinusOne] = {};
	                }
	                availables[xMinusOne][y] = new TileModel_1.Tile("" + xMinusOne, "" + y, null);
	            }
	            // tile on the top left 
	            if (!unexplored[x] || !unexplored[x][yMinusOne]) {
	                if (!availables[x]) {
	                    availables[x] = {};
	                }
	                availables[x][yMinusOne] = new TileModel_1.Tile("" + x, "" + yMinusOne, null);
	            }
	            // tile on the top right
	            if (!unexplored[xPlusOne] || !unexplored[xPlusOne][yMinusOne]) {
	                if (!availables[xPlusOne]) {
	                    availables[xPlusOne] = {};
	                }
	                availables[xPlusOne][yMinusOne] = new TileModel_1.Tile("" + xPlusOne, "" + yMinusOne, null);
	            }
	        }
	        else {
	            return null;
	        }
	        return availables;
	    }
	    static getTilePathD(path) {
	        return "M " + path.top.x + "," + path.top.y
	            + " l " + path.topRight.x + "," + path.topRight.y
	            + " l " + path.bottomRight.x + "," + path.bottomRight.y
	            + " l " + path.bottom.x + "," + path.bottom.y
	            + " l " + path.bottomLeft.x + "," + path.bottomLeft.y
	            + " l " + path.topLeft.x + "," + path.topLeft.y + "z";
	    }
	}
	BoardManager.getTileVerticesPositions = (x, y, originLeft, originTop, tileHeight, tileWidth, tileSpacing) => {
	    var tileHeight = tileHeight;
	    var tileWidth = tileWidth;
	    var tileSpacing = tileSpacing;
	    var offsetX = (tileWidth + tileSpacing) / 2;
	    var offsetY = tileHeight / 4;
	    var absoluteX = originLeft + x * (tileWidth + tileSpacing) + y * offsetX;
	    var absoluteY = originTop + y * (tileHeight + tileSpacing - offsetY);
	    return {
	        top: { x: absoluteX, y: absoluteY },
	        topRight: { x: tileWidth / 2, y: tileHeight / 4 },
	        bottomRight: { x: 0, y: tileHeight / 2 },
	        bottom: { x: -tileWidth / 2, y: tileHeight / 4 },
	        bottomLeft: { x: -tileWidth / 2, y: -tileHeight / 4 },
	        topLeft: { x: 0, y: -tileHeight / 2 }
	    };
	};
	BoardManager.getBoardPxSize = (bounds, tileHeight, tileWidth, tileSpacing) => {
	    var widthMin = (tileWidth + tileSpacing) * (Math.abs(bounds.widthMin) + 1 / 2);
	    var widthMax = (tileWidth + tileSpacing) * (Math.abs(bounds.widthMax) + 1 / 2);
	    var heightMin = (tileHeight + tileSpacing) * (Math.abs(bounds.heightMin) * 3 / 4);
	    var heightMax = (tileHeight + tileSpacing) * (Math.abs(bounds.heightMax) * 3 / 4 + 1);
	    return {
	        widthMin: widthMin,
	        widthMax: widthMax,
	        heightMin: heightMin,
	        heightMax: heightMax
	    };
	};
	exports.BoardManager = BoardManager;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const TileModel_1 = __webpack_require__(8);
	const ResourceModel_1 = __webpack_require__(12);
	// ======================================= Resources =======================================
	exports.energyResource = new ResourceModel_1.ResourceType("Energy", "⚡");
	exports.scoreResource = new ResourceModel_1.ResourceType("Score", "🏆");
	exports.resourceTypes = [exports.energyResource, exports.scoreResource];
	// ======================================= Tiles =======================================
	exports.whiteColor = new TileModel_1.Color(255, 255, 255, 255);
	exports.yellowColor = new TileModel_1.Color(202, 175, 96, 255);
	exports.redColor = new TileModel_1.Color(196, 78, 80, 255);
	exports.blueColor = new TileModel_1.Color(96, 116, 202, 255);
	exports.greenColor = new TileModel_1.Color(64, 191, 86, 255);
	exports.violetColor = new TileModel_1.Color(181, 86, 199, 255);
	exports.blackCoolor = new TileModel_1.Color(22, 22, 22, 255);
	exports.whiteTile = new TileModel_1.TileType("white", exports.whiteColor, [new TileModel_1.TileResourceCost(exports.energyResource, 1)]);
	exports.yellowTile = new TileModel_1.TileType("yellow", exports.yellowColor, [new TileModel_1.TileResourceCost(exports.energyResource, 3)]);
	exports.redTile = new TileModel_1.TileType("red", exports.redColor, [new TileModel_1.TileResourceCost(exports.energyResource, 4)]);
	exports.blueTile = new TileModel_1.TileType("blue", exports.blueColor, [new TileModel_1.TileResourceCost(exports.energyResource, 5), new TileModel_1.TileResourceCost(exports.scoreResource, 1)]);
	exports.greenTile = new TileModel_1.TileType("green", exports.greenColor, [new TileModel_1.TileResourceCost(exports.energyResource, 6)]);
	exports.violetTile = new TileModel_1.TileType("violet", exports.violetColor, [new TileModel_1.TileResourceCost(exports.energyResource, 7)]);
	exports.blackTile = new TileModel_1.TileType("black", exports.blackCoolor, [new TileModel_1.TileResourceCost(exports.energyResource, 8), new TileModel_1.TileResourceCost(exports.scoreResource, 2)]);
	exports.tileTypes = [exports.whiteTile, exports.yellowTile, exports.redTile, exports.blueTile, exports.greenTile, exports.violetTile, exports.blackTile];


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class PlayerResource {
	    constructor(amount, cap) {
	        this.amount = 0;
	        this.cap = -1;
	        this.amount = +amount;
	        if (cap)
	            this.cap = cap;
	    }
	}
	exports.PlayerResource = PlayerResource;
	class ResourceType {
	    constructor(name, icon) {
	        this.name = name;
	        this.icon = icon;
	    }
	}
	exports.ResourceType = ResourceType;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class PlayerModel {
	    constructor(players) {
	        this.players = players || [];
	    }
	}
	exports.PlayerModel = PlayerModel;
	class Player {
	    constructor(color, name) {
	        this.color = color;
	        this.name = name;
	    }
	}
	exports.Player = Player;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class EventHistory {
	    constructor(events) {
	        this.events = events || [];
	    }
	}
	exports.EventHistory = EventHistory;
	class EventType {
	    constructor() {
	        this.isLogged = true;
	    }
	}
	exports.EventType = EventType;
	class GameStateModel {
	}
	exports.GameStateModel = GameStateModel;
	var GameState;
	(function (GameState) {
	    GameState[GameState["GamePaused"] = 0] = "GamePaused";
	    GameState[GameState["GameRunning"] = 1] = "GameRunning";
	})(GameState = exports.GameState || (exports.GameState = {}));


/***/ }),
/* 15 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	class PlayerManager {
	    static getNextPlayerId(playerModel) {
	        var currentMaxId = -1;
	        playerModel.players.map(player => {
	            if (player) {
	                currentMaxId = Math.max(player.id, currentMaxId);
	            }
	        });
	        return currentMaxId + 1;
	    }
	}
	exports.PlayerManager = PlayerManager;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const ResourceModel_1 = __webpack_require__(12);
	const Database_1 = __webpack_require__(11);
	class ResourceManager {
	    static getInitialPlayerResources() {
	        var playerResources = {};
	        Database_1.resourceTypes.map((resourceType) => {
	            switch (resourceType) {
	                case Database_1.energyResource:
	                    playerResources[resourceType.name] = new ResourceModel_1.PlayerResource(10);
	                    break;
	                case Database_1.scoreResource:
	                    playerResources[resourceType.name] = new ResourceModel_1.PlayerResource(0);
	                    break;
	                default:
	                    playerResources[resourceType.name] = new ResourceModel_1.PlayerResource(0);
	                    break;
	            }
	        });
	        return playerResources;
	    }
	}
	exports.ResourceManager = ResourceManager;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	function cloneObject(source) {
	    if (source && source instanceof Object) {
	        var obj = new Object();
	        Object.keys(source).map(key => {
	            if (source[key] instanceof Object) {
	                obj[key] = cloneObject(source[key]);
	            }
	            else {
	                obj[key] = source[key];
	            }
	        });
	        return obj;
	    }
	}
	exports.cloneObject = cloneObject;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(2);
	const GameManager_1 = __webpack_require__(7);
	const BoardManager_1 = __webpack_require__(10);
	const GameModel_1 = __webpack_require__(14);
	const TileView_1 = __webpack_require__(19);
	const UI_1 = __webpack_require__(6);
	class BoardView extends React.Component {
	    constructor() {
	        super();
	        /* =================================================================================================================================== */
	        /* ======================== Event Bus Subscriptions ================================================================================== */
	        /* =================================================================================================================================== */
	        this.handleTileAddedEvent = (event) => {
	            if (!(event instanceof GameManager_1.TileAddedEvent)) {
	                return;
	            }
	            var pxBoundsBefore = BoardManager_1.BoardManager.getBoardPxSize(event.boundsBefore, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing);
	            var pxBoundsAfter = BoardManager_1.BoardManager.getBoardPxSize(event.boundsAfter, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing);
	            if (pxBoundsAfter.widthMin > pxBoundsBefore.widthMin) {
	                this.state.scrollX = this.state.scrollX - Math.abs(pxBoundsAfter.widthMin - pxBoundsBefore.widthMin);
	            }
	            if (pxBoundsAfter.heightMin > pxBoundsBefore.heightMin) {
	                this.state.scrollY = this.state.scrollY - Math.abs(pxBoundsAfter.heightMin - pxBoundsBefore.heightMin);
	            }
	            this.setState(this.state);
	        };
	        /* =================================================================================================================================== */
	        this.centerBoard = () => {
	            var bounds = BoardManager_1.BoardManager.getBounds(this.props.unexplored);
	            this.state.scrollX = -BoardManager_1.BoardManager.getBoardPxSize(bounds, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing).widthMin;
	            this.state.scrollY = -BoardManager_1.BoardManager.getBoardPxSize(bounds, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing).heightMin - this.props.tileHeight / 2;
	            this.setState(this.state);
	        };
	        this.handleUnexploredTileClick = (tile) => {
	            if (this.state.dragging || !this.state.tileMode) {
	                return;
	            }
	            if (this.props.gameStateModel.gameState == GameModel_1.GameState.GamePaused) {
	                return;
	            }
	            tile.type = this.state.tileMode;
	            var tileClickEvent = new GameManager_1.AddTileEvent(tile);
	            GameManager_1.EventBus.event(tileClickEvent);
	        };
	        this.handleTileClick = (tile) => {
	            if (this.state.dragging) {
	                return;
	            }
	            if (!this.state.selectedTile || this.state.selectedTile.x != +tile.x || this.state.selectedTile.y != +tile.y) {
	                this.state.selectedTile = { x: +tile.x, y: +tile.y };
	            }
	            else {
	                this.state.selectedTile = null;
	            }
	        };
	        this.handleOnWheel = (e) => {
	            var sign = e.deltaY / Math.abs(e.deltaY);
	            this.state.zoom = Math.max(0.2, Math.min(this.state.zoom - (sign * 0.1), 1.5));
	            this.setState(this.state);
	        };
	        this.startDrag = (e) => {
	            this.state.dragPosition = { x: e.clientX, y: e.clientY };
	        };
	        this.handleDrag = (e) => {
	            if (!this.state.dragPosition) {
	                return;
	            }
	            this.state.dragging = true;
	            this.state.scrollX = this.state.scrollX + (e.clientX - this.state.dragPosition.x) * 1 / this.state.zoom;
	            this.state.scrollY = this.state.scrollY + (e.clientY - this.state.dragPosition.y) * 1 / this.state.zoom;
	            this.state.dragPosition.x = e.clientX;
	            this.state.dragPosition.y = e.clientY;
	            this.setState(this.state);
	        };
	        this.endDrag = (e) => {
	            this.state.dragPosition = null;
	            window.setTimeout(() => {
	                this.state.dragging = false;
	                this.setState(this.state);
	            }, 0);
	        };
	        // handleCenterBoardButtonClick = () => {
	        //     this.centerBoard()
	        // }
	        // handleResetZoomButtonClicked = () => {
	        //     this.state.zoom = 1
	        //     this.setState(this.state)
	        // }
	        // handleToggleGridButtonClicked = () => {
	        //     this.state.showGrid = !this.state.showGrid
	        //     this.setState(this.state)
	        // }
	        this.handleCreateTileButtonClicked = (tileType) => {
	            if (this.props.gameStateModel.gameState == GameModel_1.GameState.GamePaused) {
	                return;
	            }
	            this.state.tileMode = this.state.tileMode == tileType ? null : tileType;
	            this.setState(this.state);
	        };
	        this.handleEscKeyPressed = () => {
	            if (this.props.gameStateModel.gameState == GameModel_1.GameState.GamePaused) {
	                return;
	            }
	            this.state.tileMode = null;
	            this.setState(this.state);
	        };
	        this.state = {
	            selectedTile: null,
	            scrollX: 0,
	            scrollY: 0,
	            zoom: 1,
	            dragging: false,
	            dragPosition: null,
	            showGrid: true,
	            didMount: false,
	            tileMode: null
	        };
	    }
	    componentWillReceiveProps(nextProps) {
	    }
	    componentWillMount() {
	        this.centerBoard();
	        GameManager_1.EventBus.subscribe(this.handleTileAddedEvent, GameManager_1.TileAddedEvent.prototype);
	    }
	    componentDidMount() {
	        if (!this.state.didMount) {
	            this.state.didMount = true;
	            this.setState(this.state);
	        }
	        window.addEventListener("keydown", (e) => {
	            if (e.code == "Escape") {
	                this.handleEscKeyPressed();
	            }
	        });
	    }
	    render() {
	        var tiles = this.props.tiles;
	        var unexplored = this.props.unexplored;
	        var paths = [];
	        var boardSize = BoardManager_1.BoardManager.getBoardPxSize(BoardManager_1.BoardManager.getBounds(this.props.unexplored), this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing);
	        var selectedTileX = "";
	        var selectedTileY = "";
	        if (this.state.selectedTile) {
	            selectedTileX = "" + this.state.selectedTile.x;
	            selectedTileY = "" + this.state.selectedTile.y;
	        }
	        Object.keys(tiles).map(xIndex => {
	            Object.keys(tiles[+xIndex]).map(yIndex => {
	                var path = BoardManager_1.BoardManager.getTileVerticesPositions(+xIndex, +yIndex, boardSize.widthMin, boardSize.heightMin, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing);
	                var classNameStart = (+xIndex == 0 && +yIndex == 0 ? "start" : "");
	                var classNameSelected = (this.state.selectedTile && +xIndex == this.state.selectedTile.x && +yIndex == this.state.selectedTile.y ? " selected" : "");
	                paths.push(React.createElement(TileView_1.TileView, { id: "x" + xIndex + "y" + yIndex, tile: tiles[xIndex][yIndex], className: classNameStart + classNameSelected, path: path, onClick: this.handleTileClick, height: this.props.tileHeight, width: this.props.tileWidth, key: xIndex + "_" + yIndex, showGrid: this.state.showGrid }));
	            });
	        });
	        Object.keys(unexplored).map(xIndex => {
	            Object.keys(unexplored[+xIndex]).map(yIndex => {
	                var path = BoardManager_1.BoardManager.getTileVerticesPositions(+xIndex, +yIndex, boardSize.widthMin, boardSize.heightMin, this.props.tileHeight, this.props.tileWidth, this.props.tileSpacing);
	                var classNameStart = (+xIndex == 0 && +yIndex == 0 ? "start" : "");
	                paths.push(React.createElement(TileView_1.TileView, { tile: unexplored[xIndex][yIndex], className: "tile unexplored" + classNameStart + (this.state.tileMode ? " reveal-mode" : ""), path: path, onClick: this.handleUnexploredTileClick, height: this.props.tileHeight, width: this.props.tileWidth, key: "a" + xIndex + "_" + yIndex, showGrid: this.state.showGrid }));
	            });
	        });
	        var svgTranslate = this.state.scrollX && this.state.scrollY ? ("translate(" + (this.state.scrollX).toString() + "px," + (this.state.scrollY).toString() + "px) ") : "";
	        var svgTransform = svgTranslate;
	        var boardPerspective = (400 + 600 * 1 / this.state.zoom) + "px";
	        var boardZoom = "scale(" + this.state.zoom + ") ";
	        var boardCenter = "translate(-50%, -50%)";
	        var boardRotate = " rotateX(30deg)";
	        var boardTransform = boardZoom + boardCenter + boardRotate;
	        var tileButtons = this.props.tileTypes ? this.props.tileTypes.map((tileType, index) => {
	            var color = "rgba(" + tileType.color.r + "," + tileType.color.g + "," + tileType.color.b + "," + tileType.color.a + ")";
	            var badgeText = [];
	            tileType.cost.map(tileResourceCost => {
	                if (tileResourceCost.amount > 0) {
	                    badgeText.push("" + tileResourceCost.amount + tileResourceCost.resourceType.icon);
	                }
	            });
	            var tileHeight = 70;
	            var tileWidth = (Math.ceil(Math.cos(Math.PI / 6) * tileHeight));
	            var d = BoardManager_1.BoardManager.getTilePathD(BoardManager_1.BoardManager.getTileVerticesPositions(0, 0, tileWidth / 2, 0, tileHeight, tileWidth, 0));
	            var pathProps = {
	                fill: color,
	                d: d,
	                stroke: "#333",
	                strokeLinecap: "round",
	                strokeWidth: "1"
	            };
	            return (React.createElement(UI_1.Button, { text: "", className: "button button-svg", id: "board-button-" + tileType.name, onClick: this.handleCreateTileButtonClicked.bind(this, tileType), active: this.state.tileMode == tileType, key: index, badgeText: badgeText, style: { height: tileHeight, width: tileWidth }, pathProps: pathProps }));
	        }) : null;
	        var resources = this.props.resourceTypes ? this.props.resourceTypes.map((resourceType, index) => {
	            var amount = this.props.gameStateModel.currentPlayer ? this.props.gameStateModel.currentPlayer.playerResources[resourceType.name].amount : 0;
	            return (React.createElement("div", { id: "resource-" + resourceType.name, className: "resource", key: index },
	                React.createElement("div", { className: "resource-icon" }, resourceType.icon),
	                React.createElement("div", { className: "resource-amount" }, amount)));
	        }) : null;
	        return (React.createElement("div", { id: "view-board", className: "view" + (this.state.tileMode ? " reveal-mode" : "") },
	            React.createElement("div", { id: "game-resources" }, resources),
	            React.createElement("div", { id: "tile-buttons" }, tileButtons),
	            React.createElement("div", { id: "board", style: { perspective: boardPerspective }, onMouseDown: this.startDrag.bind(this), onMouseMove: this.handleDrag.bind(this), onMouseUp: this.endDrag.bind(this), onWheel: this.handleOnWheel.bind(this) },
	                React.createElement("div", { id: "board-center", style: { transform: boardTransform } },
	                    React.createElement("svg", { id: "board-svg", width: boardSize.widthMin + boardSize.widthMax, height: boardSize.heightMin + boardSize.heightMax, style: { transform: svgTransform } },
	                        React.createElement("g", { id: "board-g" },
	                            paths.map(path => path),
	                            React.createElement("use", { xlinkHref: "#x" + selectedTileX + "y" + selectedTileY, style: { pointerEvents: "none" }, onClick: this.handleTileClick.bind(this), "data-x": selectedTileX, "data-y": selectedTileY })))))));
	    }
	}
	exports.BoardView = BoardView;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	/// <reference path="../../../typings/index.d.ts" />
	const React = __webpack_require__(2);
	const BoardManager_1 = __webpack_require__(10);
	class TileView extends React.Component {
	    constructor() {
	        super();
	    }
	    handlePathClick(e) {
	        if (typeof this.props.onClick == "function") {
	            this.props.onClick(this.props.tile);
	        }
	    }
	    render() {
	        var img;
	        if (this.props.tile && this.props.tile.type && this.props.tile.type.texture && this.props.tile.textureVariant) {
	            img = !(function webpackMissingModule() { var e = new Error("Cannot find module \"../../../assets/images\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());
	        }
	        var path = this.props.path;
	        var d = BoardManager_1.BoardManager.getTilePathD(path);
	        var className = "tile" + (this.props.className ? " " + this.props.className : "") + (this.props.showGrid ? " tile-grid" : "");
	        var color = this.props.tile.type ? this.props.tile.type.color : { r: 0, g: 0, b: 0, a: 255 };
	        var fill = "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")";
	        return (React.createElement("g", null,
	            img ?
	                React.createElement("image", { className: "tile-image" + (this.props.className ? " " + this.props.className : ""), xlinkHref: img, x: path.top.x, y: path.top.y, height: this.props.height, width: this.props.width }) : null,
	            React.createElement("path", { id: this.props.id, ref: "path", onClick: this.handlePathClick.bind(this), className: className, d: d, "data-x": this.props.tile.x, "data-y": this.props.tile.y, fill: fill })));
	    }
	}
	exports.TileView = TileView;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

	function webpackContext(req) {
		throw new Error("Cannot find module '" + req + "'.");
	}
	webpackContext.keys = function() { return []; };
	webpackContext.resolve = webpackContext;
	module.exports = webpackContext;
	webpackContext.id = 20;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	const React = __webpack_require__(2);
	const UI_1 = __webpack_require__(6);
	const PlayerModel_1 = __webpack_require__(13);
	const GameManager_1 = __webpack_require__(7);
	class CreatePlayerModalView extends React.Component {
	    constructor(props) {
	        super(props);
	        this.handleCreatePlayerButtonClicked = (e) => {
	            // TODO make color chooser
	            // TODO make option to add multiple players
	            var color = "ff8800";
	            var name = this.state.nameInput;
	            var addPlayerEvent = new GameManager_1.AddPlayerEvent(new PlayerModel_1.Player(color, name));
	            e.preventDefault();
	        };
	        this.handleNameInputChange = (e) => {
	            this.state.nameInput = e.currentTarget.value;
	        };
	        this.state = {
	            nameInput: null,
	            colorInput: null
	        };
	    }
	    render() {
	        return (React.createElement("div", { id: "create-player-screen", className: "modal" },
	            React.createElement("form", { action: "", onSubmit: this.handleCreatePlayerButtonClicked.bind(this), id: "create-player-form", className: "form form-modal" },
	                React.createElement(UI_1.TextInput, { id: "player-name-input", onChange: this.handleNameInputChange.bind(this) }),
	                React.createElement(UI_1.Button, { text: "Create Player", id: "create-player-button" }))));
	    }
	}
	exports.CreatePlayerModalView = CreatePlayerModalView;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(23);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(25)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/css-loader/index.js?sourcemaps!../../node_modules/postcss-loader/index.js!../../node_modules/sass-loader/index.js?sourcemaps!./main.scss", function() {
				var newContent = require("!!../../node_modules/css-loader/index.js?sourcemaps!../../node_modules/postcss-loader/index.js!../../node_modules/sass-loader/index.js?sourcemaps!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(24)();
	// imports
	
	
	// module
	exports.push([module.id, "@keyframes tileSelected {\n  0% {\n    stroke: #79D38E;\n    stroke-opacity: .9;\n    stroke-width: 15px; }\n  50% {\n    stroke: #8b9;\n    stroke-opacity: .5;\n    stroke-width: 5px; }\n  100% {\n    stroke: #79D38E;\n    stroke-opacity: .9;\n    stroke-width: 15px; } }\n\n@keyframes tileRevealMode {\n  0% {\n    fill: #666666; }\n  50% {\n    fill: #6e7e76; }\n  100% {\n    fill: #666666; } }\n\n@keyframes spin {\n  0% {\n    transform: translate(-50%, -50%) rotate(0deg); }\n  100% {\n    transform: translate(-50%, -50%) rotate(360deg); } }\n\n@keyframes dasharraySpin {\n  0% {\n    stroke-dashoffset: 0; }\n  100% {\n    stroke-dashoffset: -210; } }\n\n@keyframes tileSelected {\n  0% {\n    stroke: #79D38E;\n    stroke-opacity: .9;\n    stroke-width: 15px; }\n  50% {\n    stroke: #8b9;\n    stroke-opacity: .5;\n    stroke-width: 5px; }\n  100% {\n    stroke: #79D38E;\n    stroke-opacity: .9;\n    stroke-width: 15px; } }\n\n@keyframes tileRevealMode {\n  0% {\n    fill: #666666; }\n  50% {\n    fill: #6e7e76; }\n  100% {\n    fill: #666666; } }\n\n@keyframes spin {\n  0% {\n    transform: translate(-50%, -50%) rotate(0deg); }\n  100% {\n    transform: translate(-50%, -50%) rotate(360deg); } }\n\n@keyframes dasharraySpin {\n  0% {\n    stroke-dashoffset: 0; }\n  100% {\n    stroke-dashoffset: -210; } }\n\n#board {\n  text-align: center;\n  height: 100%; }\n  #board-center {\n    position: relative;\n    display: inline-block;\n    top: 50%;\n    width: 10px;\n    height: 10px; }\n  #board-svg {\n    position: relative; }\n\n#board-g g {\n  font-size: 10px; }\n\n#game-resources {\n  position: absolute;\n  top: 25px;\n  left: 25px;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  z-index: 2; }\n\n.resource {\n  line-height: 25px;\n  padding: 0.5em;\n  border: 2px solid #333;\n  background-color: rgba(0, 0, 0, 0.3);\n  border-radius: 1em; }\n  .resource:not(:last-child) {\n    margin-bottom: 1em; }\n  .resource-icon, .resource-amount {\n    font-size: 1.2em;\n    display: inline-block;\n    vertical-align: top; }\n  .resource-icon {\n    margin-right: 0.5em; }\n\n#tile-buttons {\n  position: absolute;\n  display: -ms-flexbox;\n  display: flex;\n  bottom: 25px;\n  left: 25px;\n  z-index: 1;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  pointer-events: none; }\n  #tile-buttons .button:not(.button-svg) {\n    pointer-events: all;\n    height: 60px;\n    width: 60px;\n    position: relative;\n    border-radius: 100%; }\n  #tile-buttons .button-svg {\n    background-color: transparent;\n    padding: 0;\n    overflow: visible;\n    box-shadow: none; }\n    #tile-buttons .button-svg path {\n      pointer-events: all; }\n      #tile-buttons .button-svg path.button-svg-active {\n        stroke: #000;\n        stroke-dasharray: .5 17;\n        stroke-width: 5;\n        animation: dasharraySpin 3s linear infinite; }\n  #tile-buttons .button-container {\n    width: 90px;\n    text-align: center;\n    pointer-events: none; }\n  #tile-buttons .button-badge {\n    pointer-events: none;\n    transform: translateY(-1em); }\n    #tile-buttons .button-badge-line {\n      display: inline-block;\n      text-align: center;\n      border: 2px solid #333;\n      border-radius: 100%;\n      background-color: rgba(32, 32, 32, 0.7);\n      width: 2em;\n      height: 2em;\n      line-height: 2em; }\n      #tile-buttons .button-badge-line + .button-badge-line {\n        margin-left: -.4em; }\n\n.tile {\n  pointer-events: all;\n  cursor: pointer;\n  stroke: transparent;\n  stroke-width: 0;\n  stroke-linecap: round;\n  stroke-opacity: 0.5;\n  position: relative;\n  z-index: 1; }\n  .tile-grid {\n    stroke-width: 3px;\n    stroke: #333;\n    stroke-opacity: 1; }\n    .tile-grid:not(.selected) {\n      stroke-dasharray: 0 !important; }\n  .tile.start {\n    stroke: #ffff7f;\n    stroke-width: 5px; }\n    .tile.start:not(.selected) {\n      stroke-dasharray: 0 !important; }\n  .tile.selected {\n    stroke-width: 5px;\n    animation: tileSelected 2s linear infinite;\n    z-index: 2; }\n  .tile:hover {\n    opacity: 0.6; }\n  .tile.unexplored {\n    fill: #666666;\n    cursor: default;\n    animation: none; }\n    .tile.unexplored.reveal-mode {\n      cursor: pointer;\n      animation: tileRevealMode 2s linear infinite; }\n    .tile.unexplored:hover {\n      fill: #555555; }\n  .tile-image {\n    pointer-events: none;\n    transform: translateX(-50%); }\n\n.button {\n  background: none;\n  border: none;\n  outline: none;\n  color: #ddd;\n  background-color: rgba(193, 180, 174, 0.5);\n  padding: 0.5em;\n  box-shadow: 0 0 15px -2px #eee inset; }\n  .button:not([disabled]) {\n    cursor: pointer; }\n    .button:not([disabled]):hover {\n      background-color: #ddd;\n      color: #372212; }\n  .button.button-active {\n    background-color: #ddd;\n    color: #372212; }\n  .button .button-active-indicator {\n    display: block;\n    width: 90%;\n    height: 90%;\n    border: 8px dotted rgba(173, 226, 93, 0.7);\n    border-radius: 100%;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform-origin: 50% 50%;\n    transform: translate(-50%, -50%);\n    animation: spin 5s linear infinite; }\n\n#view-board {\n  background-color: #777; }\n\n#view-main-menu {\n  background-color: #333; }\n\nbody {\n  margin: 0;\n  color: #ddd;\n  height: 100vh;\n  width: 100vw;\n  overflow: hidden; }\n\n#app,\n#app-container,\n#view-container,\n.view {\n  width: 100%;\n  height: 100%; }\n", ""]);
	
	// exports


/***/ }),
/* 24 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map