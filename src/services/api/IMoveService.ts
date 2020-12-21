import { Shape, Svg } from '@svgdotjs/svg.js';

export interface IMoveService {
  moveElement(event: MouseEvent, svg: Svg, shape: Shape): void;
}
