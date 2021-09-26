export class ScrollBy {
  constructor(public x: number, public y: number) {}

  negate(): ScrollBy {
    return new ScrollBy(-this.x, -this.y);
  }
}
