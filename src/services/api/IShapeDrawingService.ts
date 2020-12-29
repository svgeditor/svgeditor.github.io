import { ShapeInfo } from '../../models/ShapeInfo';

export interface IShapeDrawingService {
  createOnMouseDown(event: MouseEvent): void;
  move(event: MouseEvent, shapeToMove: ShapeInfo): void;
  select(shape: ShapeInfo): void;
  getStyles(): string;
  resize(shape: ShapeInfo): void;
}
