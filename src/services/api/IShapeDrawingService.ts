import { Shape } from '@svgdotjs/svg.js';
import { ShapeInfo } from '../../models/ShapeInfo';

export interface IShapeDrawingService<T extends Shape> {
  createOnMouseDown(event: MouseEvent): void;
  move(event: MouseEvent, shapeToMove: ShapeInfo<T>): void;
  select(shape: ShapeInfo<T>): void;
  getStyles(): string;
  resize(shape: ShapeInfo<T>): void;
  drawOnHoverGuide(shape: ShapeInfo<T>): void;
  redrawOnHoverGuide(shape: ShapeInfo<T>): void;
}
