import { Shape } from '@svgdotjs/svg.js';

export interface IWhiteboardDrawingService {
  handleMouseDownEvent(event: MouseEvent): void;
  handleClickEvent(event: MouseEvent): void;
  getStyles(): string;
  resize(): void;
  unselectAll(): void;
  deleteSelectedShapes(): void;
  draw(shape: Shape): void;
}
