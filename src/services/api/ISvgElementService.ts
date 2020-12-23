import { Shape } from '@svgdotjs/svg.js';
import { ZoomPercentage } from '../../models/ZoomPercentage';

export interface ISvgElementService {
  createOnMouseDown(event: MouseEvent): void;
  move(event: MouseEvent, shapeToMove: Shape): void;
  select(shape: Shape): void;
  getStyles(): string;
  resize(shape: Shape): void;
  resize(shape: Shape, zoomPercentage: ZoomPercentage): void;
}
