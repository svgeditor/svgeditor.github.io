import { ISvgElement } from './ISvgElement';

export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export abstract class BaseSvgElement implements ISvgElement {
  protected element: SVGElement;

  fill(color: string): ISvgElement {
    this.getSvgElement().setAttribute('fill', color);
    return this;
  }

  stroke(stroke: string): ISvgElement {
    this.getSvgElement().setAttribute('stroke', stroke);
    return this;
  }

  strokeWidth(width: number): ISvgElement {
    this.getSvgElement().setAttribute('stroke-width', width + '');
    return this;
  }

  protected getSvgElement(): SVGElement {
    if (this.element) return this.element;
    this.element = document.createElementNS(SVG_NAMESPACE, this.getSvgName());
    return this.element;
  }

  protected abstract getSvgName();
}
