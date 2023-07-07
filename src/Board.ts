import Tile from "./Tile.js";

let board: Tile | null = null;
const Board = {
  add: (tile: Tile, old: Tile | null = null) => {
    if (board == null) {
      board = tile;
    }
    if (old == null) return;
    old.replace(tile);
  },
  board: () => board,
};

export default Board;
