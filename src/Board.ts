import EventBUS from "./EventBUS.js";
import Position from "./Position.js";
import Tile from "./Tile.js";

let board: Tile | null = null;
let boardOrigin: Position | null = null;
let nextTile: Tile | null = null;
const Board = {
  new: () => {
    board = null;
    EventBUS.registerEventListener("drawnPreview", {}, (event) => {
      nextTile = event.tile;
    });
    EventBUS.registerEventListener(
      "clickedEmptyTile",
      { index: 0 },
      (event) => {
        if (nextTile == null)
          throw Error("SOmehow the board tries to append a null TIle");
        const old = event.tile;
        Board.add(nextTile, old);
      }
    );
    EventBUS.registerEventListener("endDrawing", {}, (event) => {
      board = event.tile;
      boardOrigin = event.center;
    });
  },
  add: (tile: Tile, old: Tile | null = null) => {
    if (board == null) {
      board = tile;
    }
    if (old == null) return;
    old.replace(tile);
  },
  board: () => board,
  origin: () => boardOrigin,
};

export default Board;
