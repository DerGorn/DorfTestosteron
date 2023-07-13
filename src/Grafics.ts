import Board from "./Board.js";
import Camera from "./Camera.js";
import { body, createElement } from "./DOM.js";
import EventBUS from "./EventBUS.js";
import Position from "./Position.js";
import Tile, { Directions, Terrains } from "./Tile.js";

const RADIUS = 150;
let radialFraction = 1;

const canvas = createElement("canvas", {
  style: { width: "100vw", height: "100vh" },
});
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");
if (c == null) throw Error("Fuck");
c.font = "30px Arial";
c.strokeStyle = "black";
c.lineWidth = 5;

const directionToAngleMap: { [key in Directions]: number } = {
  N: 0,
  NO: Math.PI / 3,
  SO: (2 * Math.PI) / 3,
  S: Math.PI,
  SW: (4 * Math.PI) / 3,
  NW: (5 * Math.PI) / 3,
};

const terrainColorMap: { [key in Terrains]: string } = {
  field: "yellow",
  grass: "green",
  tracks: "grey",
  village: "red",
  water: "blue",
  woods: "darkgreen",
};

const simpleDrawTile = (
  c: CanvasRenderingContext2D,
  tile: Tile,
  center: Position,
  radius: number
) => {
  tile.edges.array().forEach((edge) => {
    c.fillStyle = terrainColorMap[edge.data];
    const angle = directionToAngleMap[edge.direction];
    const off = Math.PI / 6;
    const plus = center.add(
      new Position(Math.cos(angle + off), Math.sin(angle + off)).scale(radius)
    );
    const minus = center.add(
      new Position(Math.cos(angle - off), Math.sin(angle - off)).scale(radius)
    );
    c.beginPath();
    c.moveTo(center.x, center.y);
    c.lineTo(...plus.array());
    c.lineTo(...minus.array());
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(...plus.array());
    c.lineTo(...minus.array());
    c.closePath();
    c.stroke();
  });
  // c.strokeText(tile.id, ...center.array(), 100);
};

const drawTile = (tile: Tile, center: Position, radius: number) => {
  const inflatedRadius = radius * radialFraction;
  if (!Camera.tileInCamera(center, radius)) return false;
  center = center.add(Camera.origion);
  simpleDrawTile(c, tile, center, inflatedRadius);
  EventBUS.fireEvent("drawnTile", { center, radius, tile });
  return true;
};

let centrist: { tile: Tile; center: Position } | null = null;
let wasSomethingDrawn = false;
const drawRecursion = (
  board: Tile | null,
  cameraCenter: Position,
  direction: Directions | null,
  origin: Position,
  radius: number,
  allreadyDrawn: Set<string> = new Set()
) => {
  if (board == null) return true;
  if (allreadyDrawn.has(board.id)) return true;
  const tileInCamera = drawTile(board, origin, radius);
  if (tileInCamera) wasSomethingDrawn = true;
  // console.log(board.id, tileInCamera);
  allreadyDrawn.add(board.id);
  if (centrist == null && origin.distance(cameraCenter) <= radius) {
    centrist = { tile: board, center: origin };
  }
  board.neighbours.array().forEach((con) => {
    if (
      wasSomethingDrawn &&
      !tileInCamera &&
      direction &&
      direction.split("").some((d) => con.direction.includes(d))
    ) {
      // console.log("skipong ", con.data?.id);
      return;
    }
    const angle = directionToAngleMap[con.direction];
    const newCenter = origin.add(
      new Position(Math.cos(angle), Math.sin(angle)).scale(2 * radius)
    );
    drawRecursion(
      con.data,
      cameraCenter,
      con.direction,
      newCenter,
      radius,
      allreadyDrawn
    );
  });
  return true;
};

const drawBoard = (board: Tile | null) => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  EventBUS.fireEvent("startDrawing", {});
  // console.log("\n\n\nStarting Render\n\n\n");
  const origin = Board.origin();
  // console.log(Camera.center());
  drawRecursion(
    board,
    Camera.center(),
    null,
    origin != null ? origin : new Position(canvas.width / 2, canvas.height / 2),
    RADIUS * Camera.zoom()
  );
  // console.log(centrist);
  if (centrist != null) EventBUS.fireEvent("endDrawing", centrist);
  centrist = null;
  wasSomethingDrawn = false;
};

const Grafics = {
  start: () => {
    body.append(canvas);
    radialFraction = 1 / Math.cos(Math.PI / Directions.length);
    EventBUS.registerEventListener("loop", {}, () => {
      drawBoard(Board.board());
    });
    canvas.addEventListener("click", (event) => {
      const pos = new Position(event.clientX, event.clientY);
      EventBUS.fireEvent("click", { pos, target: "BoardCanvas" });
    });
  },
};

export default Grafics;
export { RADIUS, simpleDrawTile };
