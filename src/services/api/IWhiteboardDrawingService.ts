import { Shape } from '@svgdotjs/svg.js';
import { SvgElement } from '../../models/SvgElement';

export interface IWhiteboardDrawingService {
  draw(shape: SvgElement<Shape>): void;
  drawOnMouseDown(event: MouseEvent): void;
  move(event: MouseEvent, shape: SvgElement<Shape>): void;
  select(shape: SvgElement<Shape>): void;
  selectOnMouseDown(event: MouseEvent): void;
  delete(shape: SvgElement<Shape>): void;
  bringToFront(shape: SvgElement<Shape>): void;
  sendToBack(shape: SvgElement<Shape>): void;
  resizeAllShapes(): void;
  unselectAllShapes(): void;
  getStyles(): string;
}
