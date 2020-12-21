import { Rect, Svg } from '@svgdotjs/svg.js';

export interface IRectangleElementService {
  create(svg: Svg, event: MouseEvent): void;
  getStyles(): string;
}
