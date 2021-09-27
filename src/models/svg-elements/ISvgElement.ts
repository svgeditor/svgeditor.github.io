import { BoundingRectangle } from '../BoundingRectangle';

export interface ISvgElement {
  id(id: string): ISvgElement;
  getId(): string;
  addCssClass(className: string): ISvgElement;
  removeCssClass(className: string): ISvgElement;
  removeAllCssClasses(): ISvgElement;
  backgroundColor(color: string): ISvgElement;
  borderColor(stroke: string): ISvgElement;
  borderWidth(width: number): ISvgElement;
  getElement(): SVGElement;
  clone(): ISvgElement;
  isNone(): boolean;
  getHoverHelper(): ISvgElement;
  getBoundingRectangle(): BoundingRectangle;
  add<T extends ISvgElement>(svgElement: T): T;
}
