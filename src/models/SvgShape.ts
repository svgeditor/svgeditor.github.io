import { Circle, Ellipse, G, Line, Rect, Shape } from '@svgdotjs/svg.js';

export class SvgShape<T extends Shape> {
  constructor(public container: G, public shape: T) {}
}

export class SvgRectangle extends SvgShape<Rect> {}
export class SvgCircle extends SvgShape<Circle> {}
export class SvgEllipse extends SvgShape<Ellipse> {}
export class SvgLine extends SvgShape<Line> {}

export enum ESvgShape {
  RECTANGLE,
  CIRCLE,
  ELLIPSE,
  LINE,
}
