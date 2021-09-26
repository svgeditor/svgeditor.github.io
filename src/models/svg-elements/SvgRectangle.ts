import { BoundingRectangle } from '../BoundingRectangle';
import { Position } from '../Position';
import { BaseSvgElement } from './BaseSvgElement';
import { ISvgElement } from './ISvgElement';

export class SvgRectangle extends BaseSvgElement implements ISvgElement {
  private constructor(private element: SVGRectElement) {
    super();
  }

  static from(rect: SVGRectElement) {
    return new SvgRectangle(rect);
  }

  clone(): SvgRectangle {
    const element = this.getElement().cloneNode() as SVGRectElement;
    element.removeAttribute('id');
    return new SvgRectangle(element);
  }

  getElement() {
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

  getBoundingRectangle(): BoundingRectangle {
    const x = parseInt(this.element.getAttribute('x'));
    const y = parseInt(this.element.getAttribute('y'));
    const width = parseInt(this.element.getAttribute('width'));
    const height = parseInt(this.element.getAttribute('height'));
    return new BoundingRectangle(x, y, width, height);
  }
}
