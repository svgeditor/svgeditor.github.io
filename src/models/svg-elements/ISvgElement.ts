export interface ISvgElement {
  addClass(className: string): ISvgElement;
  removeClass(className: string): ISvgElement;
  fill(color: string): ISvgElement;
  strokeColor(stroke: string): ISvgElement;
  strokeWidth(width: number): ISvgElement;
  getSvgElement(): SVGElement;
  clone(): ISvgElement;
}
