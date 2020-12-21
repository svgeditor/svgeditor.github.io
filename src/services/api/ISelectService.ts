import { Shape, Svg } from '@svgdotjs/svg.js';

export interface ISelectService {
  selectElement(svg: Svg, shape: Shape): void;
  unselectElements(svg: Svg): void;
  getStyles(): string;
}
