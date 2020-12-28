import { G } from '@svgdotjs/svg.js';
import { ShapeInfo } from '../../models/ShapeInfo';

export interface IWhiteboardDrawingService {
  createShapeOnMouseDown(event: MouseEvent): void;
  move(event: MouseEvent, shape: ShapeInfo): void;
  select(shape: ShapeInfo): void;
  getStyles(): string;
  resize(): void;
  unselectAll(): void;
  deleteShape(shape: ShapeInfo): void;
  draw(shape: ShapeInfo): void;
  bringShapeToFront(shape: ShapeInfo): void;
  sendShapeToBack(shape: ShapeInfo): void;
  getSelectedShapesGroup(): G;
}
