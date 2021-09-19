export class Color {
  constructor(public r: number, public g: number, public b: number, public a: number = 100) {}

  getRgba() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }
}
