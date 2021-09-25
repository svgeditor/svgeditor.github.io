export interface ISvgElement {
  fill(color: string): ISvgElement;
  strokeColor(stroke: string): ISvgElement;
  strokeWidth(width: number): ISvgElement;
}
