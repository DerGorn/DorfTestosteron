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
  #edges: Edges;
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
    this.#edges = new DirectionManager(...edges);
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
}

export default Tile;
