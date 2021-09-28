import { BoundingRectangle } from '../BoundingRectangle';

export interface ISvgElement {
  addCssClass(className: string): ISvgElement;
  removeCssClass(className: string): ISvgElement;
  removeAllCssClasses(): ISvgElement;
  backgroundColor(color: string): ISvgElement;
  borderColor(stroke: string): ISvgElement;
  borderWidth(width: number): ISvgElement;
  setAttribute(name: string, value: string): ISvgElement;
  getElement(): SVGElement;
  clone(): ISvgElement;
  isNone(): boolean;
  getBoundingRectangle(): BoundingRectangle;
  add<T extends ISvgElement>(svgElement: T): T;
}
