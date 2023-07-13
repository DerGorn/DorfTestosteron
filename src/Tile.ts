import { getRandomArrayEl, getUniqueId, veryDirtyFactorial } from "./DOM.js";

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

  rotate(clockwise = true) {
    const temp = this.N;
    if (clockwise) {
      this.N = this.NW;
      this.NW = this.SW;
      this.SW = this.S;
      this.S = this.SO;
      this.SO = this.NO;
      this.NO = temp;
    } else {
      this.N = this.NO;
      this.NO = this.SO;
      this.SO = this.S;
      this.S = this.SW;
      this.SW = this.NW;
      this.NW = temp;
    }
  }
}

type Neighbours = DirectionManager<Neighbour>;
type Edges = DirectionManager<Terrains>;

const straightProbability = 0.5;

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
  neighbours: Neighbours;
  edges: Edges;
  #links: Links;
  id: string;

  constructor(
    edges: Edges,
    { empty = false }: { empty?: boolean } = {},
    ...neighbours: Connection[]
  ) {
    this.id = getUniqueId("Tile");
    this.neighbours = new DirectionManager();
    neighbours.forEach((neighbour) => {
      this.connect(neighbour);
    });
    this.edges = edges;
    this.#calculateLinks();
    if (empty) return;
    this.#fillNullNeighbours();
  }

  #calculateLinks() {
    this.#links = {};
    Object.entries(this.edges).forEach(
      ([direction, data]: [Directions, Terrains]) => {
        const terrain = data;
        if (this.#links[terrain] == null) {
          this.#links[terrain] = new Set();
        }
        this.#links[terrain]?.add(direction);
      }
    );
  }

  connect(con: Connection, connectToNeighbour = true) {
    this.neighbours.connect(con);
    if (con.data == null || !connectToNeighbour) return;
    con.data.connect(
      {
        direction: flipDirection(con.direction),
        data: this,
      },
      false
    );
  }

  isEmpty() {
    return this.edges.array().length < Directions.length;
  }

  replace(tile: Tile, replaceNeighbours = true) {
    this.neighbours.array().forEach((con) => {
      const dir = con.direction;
      const neighbour = tile.neighbours[dir];
      if (neighbour != null && replaceNeighbours) {
        neighbour.replace(con.data as Tile, false);
      }
      tile.connect(
        {
          direction: dir,
          data: con.data,
        },
        true
      );
    });
  }

  remove() {
    this.neighbours.array().forEach((con) => {
      con.data?.connect(
        {
          direction: flipDirection(con.direction),
          data: null,
        },
        false
      );
    });
  }

  #fillNullNeighbours() {
    const connectedDirections = this.neighbours.array().map((c) => c.direction);
    Directions.filter((dir) => !connectedDirections.includes(dir)).forEach(
      (dir) => {
        const empty = Tile.empty();
        const directionIndex = Directions.indexOf(dir);
        const neighbourDirections = [
          directionIndex > 0 ? directionIndex - 1 : Directions.length - 1,
          directionIndex < Directions.length - 1 ? directionIndex + 1 : 0,
        ].map((i) => Directions[i]);
        neighbourDirections.forEach((dir, i) => {
          const neighbour = this.neighbours[dir];
          if (neighbour == null) return;
          neighbour.connect({
            direction: neighbourDirections[(i + 1) % 2],
            data: empty,
          });
        });
        this.connect({ direction: dir, data: empty });
      }
    );
  }

  rotate(clockwise = true) {
    this.edges.rotate(clockwise);
    this.#calculateLinks();
  }

  static empty(...neighbours: Connection[]) {
    return new Tile(new DirectionManager(), { empty: true }, ...neighbours);
  }

  static random() {
    let possibleTerrains = Terrains.map((t) => t);
    const selectedTerrains: Terrains[] = [];
    const amounts = [];
    let totalAmount = 0;
    while (totalAmount < Directions.length) {
      const terrain = getRandomArrayEl(possibleTerrains);
      selectedTerrains.push(terrain);
      possibleTerrains = possibleTerrains.filter((t) => t !== terrain);
      let remaining = Directions.length - totalAmount;
      let amount = Math.floor(Math.random() * veryDirtyFactorial(remaining));
      for (let i = remaining; i > 0; i--) {
        amount /= i;
        if (amount > 1) continue;
        amount = i;
        break;
      }
      totalAmount += amount;
      amounts.push(amount);
      remaining = Directions.length - totalAmount;
      if (possibleTerrains.length === 3 && remaining > 0) {
        if (!possibleTerrains.includes("grass")) {
          amounts[possibleTerrains.indexOf("grass")] += remaining;
        } else {
          amounts.push(remaining);
          selectedTerrains.push("grass");
        }
      }
    }
    const edges: Edges = new DirectionManager();
    const customDirections = Directions.map((d) => d);
    if (amounts.every((a) => a === 2) && Math.random() < straightProbability) {
      customDirections[Directions.indexOf("NO")] = "S";
      customDirections[Directions.indexOf("S")] = "NO";
    }
    let amountIndex = 0;
    for (let i = 0; i < customDirections.length; i++) {
      if (
        amounts
          .filter((_, j) => j <= amountIndex)
          .reduce((sum, a) => sum + a, 0) <
        i + 1
      )
        amountIndex++;
      edges[customDirections[i]] = selectedTerrains[amountIndex];
    }
    return new Tile(edges as Edges);
  }
}

export default Tile;
export { Directions, Terrains, Connection, flipDirection };
