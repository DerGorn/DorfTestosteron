import Board from "./Board.js";
import EventBUS from "./EventBUS.js";
import { canvas } from "./Grafics.js";
import Position from "./Position.js";
import Tile from "./Tile.js";

let TileGraph: { center: Position; radius: number; tile: Tile }[] = [];

const MouseListener = {
  start: () => {
    EventBUS.registerEventListener("drawnTile", {}, (event) => {
      TileGraph.push(event);
    });
    EventBUS.registerEventListener("startDrawing", {}, () => {
      TileGraph = [];
    });
    canvas.addEventListener("click", (event) => {
      const pos = new Position(event.clientX, event.clientY);
      const clicked = TileGraph.find((t) => pos.distance(t.center) <= t.radius);
      console.log(clicked);
      if (clicked === undefined) return;
      const newTile = Tile.random();
      const old = clicked.tile;
      console.log(newTile.id, old);
      Board.add(newTile, old);
    });
  },
};

export default MouseListener;
