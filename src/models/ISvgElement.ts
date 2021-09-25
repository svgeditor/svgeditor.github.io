export interface ISvgElement {
  fill(color: string): ISvgElement;
  stroke(stroke: string): ISvgElement;
  strokeWidth(width: number): ISvgElement;
}
