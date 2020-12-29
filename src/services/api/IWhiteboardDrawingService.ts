import { G, Shape } from '@svgdotjs/svg.js';
import { ShapeInfo } from '../../models/ShapeInfo';

export interface IWhiteboardDrawingService {
  createShapeOnMouseDown(event: MouseEvent): void;
  move(event: MouseEvent, shape: ShapeInfo<Shape>): void;
  select(shape: ShapeInfo<Shape>): void;
  getStyles(): string;
  resize(): void;
  unselectAll(): void;
  deleteShape(shape: ShapeInfo<Shape>): void;
  draw(shape: ShapeInfo<Shape>): void;
  bringShapeToFront(shape: ShapeInfo<Shape>): void;
  sendShapeToBack(shape: ShapeInfo<Shape>): void;
  getSelectedShapesGroup(): G;
}
