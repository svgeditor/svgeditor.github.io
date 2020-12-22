import { Shape } from '@svgdotjs/svg.js';

export interface ISvgElementService {
  createOnMouseDown(event: MouseEvent): void;
  move(event: MouseEvent, shapeToMove: Shape): void;
  select(shape: Shape): void;
  unselectAll(): void;
  getStyles(): string;
}
