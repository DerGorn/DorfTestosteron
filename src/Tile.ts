import { getRandomArrayEl } from "./DOM.js";

type Neighbour = Tile | null;
const Directions = ["N", "NO", "SO", "S", "SW", "NW"] as const;
type Directions = (typeof Directions)[number];
type DirectionData<T> = { direction: Directions; data: T };
type Connection = DirectionData<Neighbour>;
const Terrains = [
  "field",
  "grass",
  "woods",
  "village",
  "tracks",
  "water",
] as const;
type Terrains = (typeof Terrains)[number];
type Edge = DirectionData<Terrains>;
type Link = Set<Directions>;
type Links = { [key in Terrains]?: Link };

class DirectionManager<T> {
  N: T | null;
  NO: T | null;
  SO: T | null;
  S: T | null;
  SW: T | null;
  NW: T | null;

  constructor(...directions: DirectionData<T>[]) {
    this.N = null;
    this.NO = null;
    this.SO = null;
    this.S = null;
    this.SW = null;
    this.NW = null;
    directions.forEach((con) => this.connect(con));
  }

  connect(con: DirectionData<T>) {
    this[con.direction] = con.data;
  }

  array(): DirectionData<T>[] {
    return Directions.filter(
      (direction: Directions) => this[direction] != null
    ).map((direction: Directions) => {
      return { direction, data: this[direction] as T };
    });
  }
}

type Neighbours = DirectionManager<Neighbour>;
type Edges = DirectionManager<Terrains>;

const flipDirection = (direction: Directions): Directions => {
  let flip = "";
  for (let i = 0; i < direction.length; i++) {
    switch (direction[i]) {
      case "S":
        flip += "N";
        break;
      case "N":
        flip += "S";
        break;
      case "O":
        flip += "W";
        break;
      case "W":
        flip += "O";
        break;
    }
  }
  return flip as Directions;
};

class Tile {
  #neighbours: Neighbours;
  edges: Edges;
  #links: Links;

  constructor(
    {
      n,
      no,
      so,
      s,
      sw,
      nw,
    }: {
      n: Terrains;
      no: Terrains;
      so: Terrains;
      s: Terrains;
      sw: Terrains;
      nw: Terrains;
    },
    ...neighbours: Connection[]
  ) {
    this.#neighbours = new DirectionManager(...neighbours);
    neighbours.forEach((neighbour) => {
      if (neighbour.data == null) return;
      neighbour.data.connect({
        direction: flipDirection(neighbour.direction),
        data: this,
      });
    });
    this.#links = {};
    const edges: Edge[] = [n, no, so, s, sw, nw].map((t, dirIndex) => {
      return { direction: Directions[dirIndex], data: t };
    });
    this.edges = new DirectionManager(...edges);
    edges.forEach((edge) => {
      const terrain = edge.data;
      if (this.#links[terrain] == null) {
        this.#links[terrain] = new Set();
      }
      this.#links[terrain]?.add(edge.direction);
    });
  }

  connect(con: Connection) {
    this.#neighbours[con.direction] = con.data;
  }

  static random() {
    const edges: Edge[] = [];
    const usedTerrains = new Set();
    const n = getRandomArrayEl(Terrains as unknown as Terrains[]);
    let neighbourProbRatio = 3;
    if (n === "tracks" || n === "water") {
      neighbourProbRatio = 1;
    }
    edges.push({ direction: "N", data: n });
    let terrains = Terrains.filter((v) => v != n);
    if (!terrains.includes("grass")) terrains.push("grass");
    const drawWithAdvantage = (advantaged: Terrains) => {
      const totalCount =
        terrains.length + (neighbourProbRatio > 0 ? neighbourProbRatio : 0);
      let terrain = terrains[Math.floor(Math.random() * totalCount)];
      if (terrain == undefined) {
        neighbourProbRatio -= 1;
        terrain = advantaged;
      } else {
        usedTerrains.add(terrain);
      }
      return terrain;
    };
    ["NW", "NO"].forEach((direction: Directions) => {
      const terrain = drawWithAdvantage(n);
      edges.push({ direction, data: terrain });
    });
    if (n === "tracks" || n === "water") {
      neighbourProbRatio += 1;
    }
    if (usedTerrains.size === 2) {
      terrains = terrains.filter((v) => usedTerrains.has(v));
      if (!terrains.includes("grass")) terrains.push("grass");
    }
    const s = drawWithAdvantage(n);
    edges.push({ direction: "S", data: s });
    if (n !== "tracks" && n !== "water" && s === n) {
      neighbourProbRatio += 1;
    }
    if (usedTerrains.size === 2) {
      terrains = terrains.filter((v) => usedTerrains.has(v));
      if (!terrains.includes("grass")) terrains.push("grass");
      neighbourProbRatio = 1;
    }
    ["SW", "SO"].forEach((direction: Directions) => {
      edges.push({ direction, data: drawWithAdvantage(n) });
    });
    return new Tile(
      edges.reduce((ob, edge) => {
        (
          ob as {
            n: Terrains;
            no: Terrains;
            so: Terrains;
            s: Terrains;
            sw: Terrains;
            nw: Terrains;
          }
        )[
          edge.direction.toLowerCase() as "n" | "no" | "so" | "s" | "sw" | "nw"
        ] = edge.data;
        return ob;
      }, {}) as {
        n: Terrains;
        no: Terrains;
        so: Terrains;
        s: Terrains;
        sw: Terrains;
        nw: Terrains;
      }
    );
  }
}

export default Tile;
export { Directions, Terrains };
