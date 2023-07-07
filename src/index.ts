import Board from "./Board.js";
import Grafics from "./Grafics.js";
import { Loop } from "./Loop.js";
import MouseListener from "./MouseInput.js";
import Tile from "./Tile.js";

const tile = Tile.random();
Board.add(tile);
const t2 = Tile.random();
Board.add(t2, tile.neighbours["S"]);
Board.add(Tile.random(), t2.neighbours["NW"] as Tile);
Grafics.start();
MouseListener.start();
Loop.start();
