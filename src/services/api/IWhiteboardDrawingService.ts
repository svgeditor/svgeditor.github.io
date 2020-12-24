import { Svg } from '@svgdotjs/svg.js';
import { ZoomLevel } from '../../models/ZoomLevel';

export interface IWhiteboardDrawingService {
  handleMouseDownEvent(event: MouseEvent): void;
  handleClickEvent(event: MouseEvent): void;
  getStyles(): string;
  resize(zoomPercentage: ZoomLevel): void;
  resize(zoomPercentage: ZoomLevel, svg: Svg): void;
  unselectAll(): void;
  deleteSelectedShapes(): void;
}
