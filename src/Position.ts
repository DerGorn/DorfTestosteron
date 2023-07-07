class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(p: Position) {
    return new Position(this.x + p.x, this.y + p.y);
  }

  addScalar(s: number) {
    return new Position(this.x + s, this.y + s);
  }

  multipy(p: Position) {
    return this.x * p.x + this.y * p.y;
  }

  length() {
    return this.multipy(this);
  }

  distance(p: Position) {
    return Math.sqrt(this.add(p.scale(-1)).length());
  }

  scale(s: number) {
    return new Position(this.x * s, this.y * s);
  }

  array(): [number, number] {
    return [this.x, this.y];
  }
}

export default Position;
