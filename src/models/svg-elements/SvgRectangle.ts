import { BoundingRectangle } from '../BoundingRectangle';
import { ISvgElement } from './ISvgElement';

export class SvgRectangle implements ISvgElement {
  private constructor(private rect: SVGRectElement) {}

  static from(rect: SVGRectElement) {
    return new SvgRectangle(rect);
  }

  fill(color: string): SvgRectangle {
    this.rect.setAttribute('fill', color);
    return this;
  }
  strokeColor(stroke: string): SvgRectangle {
    this.rect.setAttribute('stroke', stroke);
    return this;
  }
  strokeWidth(width: number): SvgRectangle {
    this.rect.setAttribute('stroke-width', width + '');
    return this;
  }

  move(x: number, y: number): SvgRectangle {
    this.rect.setAttribute('x', x + '');
    this.rect.setAttribute('y', y + '');
    return this;
  }

  size(width: number, height: number): SvgRectangle {
    this.rect.setAttribute('width', width + '');
    this.rect.setAttribute('height', height + '');
    return this;
  }

  boundingRectangle(boundingRectangle: BoundingRectangle): SvgRectangle {
    this.rect.setAttribute('x', boundingRectangle.x + '');
    this.rect.setAttribute('y', boundingRectangle.y + '');
    this.rect.setAttribute('width', boundingRectangle.width + '');
    this.rect.setAttribute('height', boundingRectangle.height + '');
    return this;
  }
}
