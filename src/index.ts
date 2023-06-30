import { body, createElement } from "./DOM.js";
import { Loop } from "./Loop.js";
import Tile, { Directions, Terrains } from "./Tile.js";

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

const drawTile = (tile: Tile) => {
  c.clearRect(0, 0, canvas.width, canvas.height);
  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  const radius = 150;
  tile.edges.array().forEach((edge) => {
    c.fillStyle = terrainColorMap[edge.data];
    const angle = directionToAngleMap[edge.direction];
    const off = Math.PI / 6;
    c.beginPath();
    c.moveTo(center.x, center.y);
    c.lineTo(
      center.x + radius * Math.cos(angle + off),
      center.y + radius * Math.sin(angle + off)
    );
    c.lineTo(
      center.x + radius * Math.cos(angle - off),
      center.y + radius * Math.sin(angle - off)
    );
    c.closePath();
    c.fill();
  });
};

const tile = Tile.random();
console.log(tile);
drawTile(tile);
Loop.start();
