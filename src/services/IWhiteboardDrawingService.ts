import { Shape } from '@svgdotjs/svg.js';
import { SvgShape } from '../models/SvgShape';

export interface IWhiteboardDrawingService {
  draw(shape: SvgShape<Shape>): void;
  drawOnMouseDown(event: MouseEvent): void;
  move(event: MouseEvent, shapes: SvgShape<Shape>[]): void;
  select(shapes: SvgShape<Shape>[]): void;
  selectOnMouseDown(event: MouseEvent): void;
  delete(shapes: SvgShape<Shape>[]): void;
  bringToFront(shapes: SvgShape<Shape>[]): void;
  sendToBack(shapes: SvgShape<Shape>[]): void;
  resizeAllShapes(): void;
  unselectAllShapes(): void;
  unselectAllShapesToSelectNewShape(): void;
  selectAllShapes(): void;
  getAllShapes(): SvgShape<Shape>[];
  getAllSelectedShapes(): SvgShape<Shape>[];
  getStyles(): string;
}
