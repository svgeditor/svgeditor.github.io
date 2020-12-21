import { Svg } from '@svgdotjs/svg.js';

export interface IRectangleElementService {
  create(event: MouseEvent, svg: Svg): void;
  getStyles(): string;
}
