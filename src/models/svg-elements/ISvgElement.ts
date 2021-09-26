import { BoundingRectangle } from '../BoundingRectangle';

export interface ISvgElement {
  id(id: string): ISvgElement;
  getId(): string;
  addClass(className: string): ISvgElement;
  removeClass(className: string): ISvgElement;
  fill(color: string): ISvgElement;
  strokeColor(stroke: string): ISvgElement;
  strokeWidth(width: number): ISvgElement;
  getElement(): SVGElement;
  clone(): ISvgElement;
  isEmpty(): boolean;
  removeAllClasses(): ISvgElement;
  getHoverHelper(): ISvgElement;
  getBoundingRectangle(): BoundingRectangle;
}
