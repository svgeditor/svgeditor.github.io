import { BoundingRectangle } from '../BoundingRectangle';
import { Position } from '../Position';
import { ISvgElement } from './ISvgElement';

export class SvgRectangle implements ISvgElement {
  private constructor(private element: SVGRectElement) {}

  static from(rect: SVGRectElement) {
    return new SvgRectangle(rect);
  }

  fill(color: string): SvgRectangle {
    this.element.setAttribute('fill', color);
    return this;
  }
  strokeColor(stroke: string): SvgRectangle {
    this.element.setAttribute('stroke', stroke);
    return this;
  }
  strokeWidth(width: number): SvgRectangle {
    this.element.setAttribute('stroke-width', width + '');
    return this;
  }

  addClass(className: string): SvgRectangle {
    this.element.classList.add(className);
    return this;
  }

  removeClass(className: string): SvgRectangle {
    this.element.classList.remove(className);
    return this;
  }

  clone(): SvgRectangle {
    const element = this.getSvgElement().cloneNode() as SVGRectElement;
    element.removeAttribute('id');
    return new SvgRectangle(element);
  }

  getSvgElement() {
    return this.element;
  }

  move(position: Position): SvgRectangle {
    this.element.setAttribute('x', position.x + '');
    this.element.setAttribute('y', position.y + '');
    return this;
  }

  boundingRectangle(boundingRectangle: BoundingRectangle): SvgRectangle {
    this.element.setAttribute('x', boundingRectangle.x + '');
    this.element.setAttribute('y', boundingRectangle.y + '');
    this.element.setAttribute('width', boundingRectangle.width + '');
    this.element.setAttribute('height', boundingRectangle.height + '');
    return this;
  }
}
