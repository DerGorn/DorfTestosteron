import { Loop } from "./Loop.js";
import Tile from "./Tile.js";

const t = new Tile({
  n: "field",
  no: "field",
  so: "field",
  s: "grass",
  sw: "tracks",
  nw: "grass",
});
const t2 = new Tile(
  {
    n: "field",
    no: "tracks",
    so: "field",
    s: "grass",
    sw: "tracks",
    nw: "grass",
  },
  { direction: "NO", data: t }
);
console.log(t);
Loop.start();
