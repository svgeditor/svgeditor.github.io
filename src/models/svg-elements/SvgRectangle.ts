import { ISvgElement } from './ISvgElement';

export class SvgRectangle implements ISvgElement {
  private constructor(private rect: SVGRectElement) {}

  static from(rect: SVGRectElement) {
    return new SvgRectangle(rect);
  }

  fill(color: string): ISvgElement {
    this.rect.setAttribute('fill', color);
    return this;
  }
  strokeColor(stroke: string): ISvgElement {
    this.rect.setAttribute('stroke', stroke);
    return this;
  }
  strokeWidth(width: number): ISvgElement {
    this.rect.setAttribute('stroke-width', width + '');
    return this;
  }
}
