import { Shape } from '@svgdotjs/svg.js';
import { ZoomLevel } from '../../models/ZoomLevel';

export interface IShapeService {
  createOnMouseDown(event: MouseEvent): void;
  move(event: MouseEvent, shapeToMove: Shape): void;
  select(shape: Shape): void;
  getStyles(): string;
  resize(shape: Shape, zoomPercentage: ZoomLevel): void;
}
