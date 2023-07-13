import { body, createElement } from "./DOM.js";
import EventBUS from "./EventBUS.js";
import { RADIUS, simpleDrawTile } from "./Grafics.js";
import KeyboardListener from "./KeyboardInput.js";
import Position from "./Position.js";
import Tile from "./Tile.js";

const RADIUSSCALEFORCANVAS = 2.2;
let nextTile: Tile | null = null;

const canvas = createElement("canvas", {
  style: {
    width: `${RADIUSSCALEFORCANVAS * RADIUS}px`,
    height: `${RADIUSSCALEFORCANVAS * RADIUS}px`,
    position: "absolute",
    bottom: "0px",
    right: "0px",
    zIndex: "1",
  },
});
canvas.width = RADIUSSCALEFORCANVAS * RADIUS;
canvas.height = RADIUSSCALEFORCANVAS * RADIUS;
const c = canvas.getContext("2d");
if (c == null) throw Error("Fuck");
c.font = "30px Arial";
c.strokeStyle = "black";
c.lineWidth = 5;

const drawTile = () => {
  if (nextTile == null)
    throw Error("Somehow the Prevoiew shall draw a null tile");
  simpleDrawTile(
    c,
    nextTile,
    new Position(canvas.width / 2, canvas.height / 2),
    RADIUS
  );
  EventBUS.fireEvent("drawnPreview", { tile: nextTile });
  return true;
};

const Preview = {
  start: () => {
    body.append(canvas);
    nextTile = Tile.random();
    drawTile();
    EventBUS.registerEventListener("clickedEmptyTile", {}, () => {
      nextTile = Tile.random();
      drawTile();
    });
    EventBUS.registerEventListener("loop", {}, () => {
      if (nextTile == null) return;
      if (KeyboardListener.pressedKeys().has("q")) {
        KeyboardListener.pressedKeys().delete("q");
        nextTile.rotate(false);
        drawTile();
      }
      if (KeyboardListener.pressedKeys().has("e")) {
        KeyboardListener.pressedKeys().delete("e");
        nextTile.rotate(true);
        drawTile();
      }
    });
  },
};

export default Preview;
