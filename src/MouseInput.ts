import EventBUS from "./EventBUS.js";
import Position from "./Position.js";
import Tile from "./Tile.js";

let TileGraph: { center: Position; radius: number; tile: Tile }[] = [];

let emptyTiles: Tile[] = [];
let validEmptyTiles: string[] = [];

const MouseListener = {
  start: () => {
    EventBUS.registerEventListener("drawnTile", {}, (event) => {
      TileGraph.push(event);
      if (!event.tile.isEmpty()) return;
      emptyTiles.push(event.tile);
    });
    EventBUS.registerEventListener("drawnPreview", {}, (event) => {
      validEmptyTiles = emptyTiles.reduce((valids: string[], tile) => {
        if (tile.checkCompatibility(event.tile)) valids.push(tile.id);
        return valids;
      }, []);
      EventBUS.fireEvent("validatedEmptyTiles", { validEmptyTiles });
    });
    EventBUS.registerEventListener("startDrawing", {}, () => {
      TileGraph = [];
      emptyTiles = [];
    });
    EventBUS.registerEventListener("click", {}, (event) => {
      switch (event.target) {
        case "BoardCanvas":
          const clicked = TileGraph.find(
            (t) => event.pos.distance(t.center) <= t.radius
          );
          // console.log(TileGraph, clicked, event.pos);
          if (
            clicked === undefined ||
            !clicked.tile.isEmpty() ||
            !validEmptyTiles.includes(clicked.tile.id)
          )
            return;
          EventBUS.fireEvent("clickedEmptyTile", { tile: clicked.tile });
          break;
      }
    });
  },
};

export default MouseListener;
