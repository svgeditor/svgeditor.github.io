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

  getName(): string {
    switch (true) {
      case this.shape instanceof Rect:
        return 'Rectangle';
      case this.shape instanceof Circle:
        return 'Circle';
      case this.shape instanceof Ellipse:
        return 'Ellipse';
      case this.shape instanceof Line:
        return 'Line';
      default:
        return 'Shape';
    }
  }

  getIconName(): string {
    switch (true) {
      case this.shape instanceof Rect:
        return 'ph:rectangle-fill';
      case this.shape instanceof Circle:
        return 'clarity:circle-solid';
      case this.shape instanceof Ellipse:
        return 'mdi:ellipse';
      case this.shape instanceof Line:
        return 'la:slash';
      default:
        return 'Shape';
    }
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
