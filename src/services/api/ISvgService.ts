import { Svg } from '@svgdotjs/svg.js';
import { ZoomPercentage } from '../../models/ZoomPercentage';

export interface ISvgService {
  handleMouseDownEvent(event: MouseEvent): void;
  handleClickEvent(event: MouseEvent): void;
  getStyles(): string;
  resize(): void;
  resize(svg: Svg, zoomPercentage: ZoomPercentage): void;
  unselectAll(): void;
  deleteSelectedShapes(): void;
}
