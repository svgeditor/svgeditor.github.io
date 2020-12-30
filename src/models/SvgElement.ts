import { Circle, Ellipse, G, Line, Rect, Shape } from '@svgdotjs/svg.js';

export class SvgElement<T extends Shape> {
  constructor(public container: G, public element: T) {}
}

export class SvgRectangle extends SvgElement<Rect> {}
export class SvgCircle extends SvgElement<Circle> {}
export class SvgEllipse extends SvgElement<Ellipse> {}
export class SvgLine extends SvgElement<Line> {}

export enum ESvgElement {
  RECTANGLE,
  CIRCLE,
  ELLIPSE,
  LINE,
}
