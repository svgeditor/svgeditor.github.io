import { Circle, Ellipse, G, Line, Rect, Shape } from '@svgdotjs/svg.js';

export class SvgShape<T extends Shape> {
  constructor(private container: G, private shape: T) {}

  inside(rectangle: Rect): boolean {
    return (
      this.shape.x() >= rectangle.x() &&
      this.shape.y() >= rectangle.y() &&
      this.shape.x() + this.shape.width() <= rectangle.x() + rectangle.width() &&
      this.shape.y() + this.shape.height() <= rectangle.y() + rectangle.height()
    );
  }

  getContainer(): G {
    return this.container;
  }

  getShape(): T {
    return this.shape;
  }

  getId(): string {
    return this.container.id();
  }
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
