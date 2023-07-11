import EventBUS from "./EventBUS.js";
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
    EventBUS.registerEventListener("click", {}, (event) => {
      switch (event.target) {
        case "BoardCanvas":
          const clicked = TileGraph.find(
            (t) => event.pos.distance(t.center) <= t.radius
          );
          // console.log(TileGraph, clicked, event.pos);
          if (clicked === undefined || !clicked.tile.isEmpty()) return;
          EventBUS.fireEvent("clickedEmptyTile", { tile: clicked.tile });
          break;
      }
    });
  },
};

export default MouseListener;
