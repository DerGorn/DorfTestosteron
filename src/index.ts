import Board from "./Board.js";
import Camera from "./Camera.js";
import Grafics from "./Grafics.js";
import KeyboardListener from "./KeyboardInput.js";
import { Loop } from "./Loop.js";
import MouseListener from "./MouseInput.js";
import Preview from "./Preview.js";
import Tile from "./Tile.js";

Board.new();
Board.add(Tile.random());
// const tile = Tile.random();
// Board.add(tile);
// const t2 = Tile.random();
// Board.add(t2, tile.neighbours["S"]);
// Board.add(Tile.random(), t2.neighbours["NW"] as Tile);
MouseListener.start();
Camera.start();
Grafics.start();
Preview.start();
KeyboardListener.start();
Loop.start();

//TODO: ValidateEmptyTiles on startup
