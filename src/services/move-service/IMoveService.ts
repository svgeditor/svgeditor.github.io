import { Shape } from '@svgdotjs/svg.js';

export interface IMoveService {
  moveElement(event: MouseEvent, shape: Shape): void;
}
