import { Circle, Ellipse, G, Line, Rect, Shape } from '@svgdotjs/svg.js';

export class ShapeInfo<T extends Shape> {
  constructor(public container: G, public shape: T) {}
}

export class RectangleInfo extends ShapeInfo<Rect> {}
export class CircleInfo extends ShapeInfo<Circle> {}
export class EllipseInfo extends ShapeInfo<Ellipse> {}
export class LineInfo extends ShapeInfo<Line> {}
