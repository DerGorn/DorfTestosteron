import Board from "./Board.js";
import { body, createElement } from "./DOM.js";
import EventBUS from "./EventBUS.js";
import Position from "./Position.js";
import Tile, { Directions, Terrains } from "./Tile.js";

let radialFraction = 1;

const canvas = createElement("canvas", {
  style: { width: "100vw", height: "100vh" },
});
body.append(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");
if (c == null) throw Error("Fuck");

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

const drawTile = (tile: Tile, center: Position, radius: number) => {
  const inflatedRadius = radius * radialFraction;
  c.font = "30px Arial";
  tile.edges.array().forEach((edge) => {
    c.fillStyle = terrainColorMap[edge.data];
    const angle = directionToAngleMap[edge.direction];
    const off = Math.PI / 6;
    const plus = center.add(
      new Position(Math.cos(angle + off), Math.sin(angle + off)).scale(
        inflatedRadius
      )
    );
    const minus = center.add(
      new Position(Math.cos(angle - off), Math.sin(angle - off)).scale(
        inflatedRadius
      )
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
  c.strokeText(tile.id, ...center.array(), 100);
  EventBUS.fireEvent("drawnTile", { center, radius, tile });
};

const drawBoard = (
  board: Tile | null,
  maxDepth = Infinity,
  origin = new Position(canvas.width / 2, canvas.height / 2),
  radius = 150,
  allreadyDrawn: Set<string> = new Set(),
  depth = 0
) => {
  if (board == null || depth > maxDepth) return false;
  if (allreadyDrawn.has(board.id)) return true;
  drawTile(board, origin, radius);
  allreadyDrawn.add(board.id);
  board.neighbours.array().forEach((con) => {
    const angle = directionToAngleMap[con.direction];
    const newCenter = origin.add(
      new Position(Math.cos(angle), Math.sin(angle)).scale(2 * radius)
    );
    if (
      drawBoard(con.data, maxDepth, newCenter, radius, allreadyDrawn, depth + 1)
    ) {
      c.strokeStyle = "black";
      c.lineWidth = 5;
      c.beginPath();
      c.moveTo(origin.x, origin.y);
      c.lineTo(newCenter.x, newCenter.y);
      c.closePath();
      c.stroke();
    }
  });
  return true;
};

const Grafics = {
  start: () => {
    EventBUS.registerEventListener("loop", {}, () => {
      radialFraction = 1 / Math.cos(Math.PI / Directions.length);
      c.clearRect(0, 0, canvas.width, canvas.height);
      EventBUS.fireEvent("startDrawing", {});
      drawBoard(Board.board(), Infinity);
    });
  },
};

export default Grafics;
export { canvas };
