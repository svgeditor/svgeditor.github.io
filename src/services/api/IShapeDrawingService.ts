import { Shape } from '@svgdotjs/svg.js';
import { SvgElement } from '../../models/SvgElement';

export interface IShapeDrawingService<T extends Shape> {
  draw(event: MouseEvent): void;
  move(event: MouseEvent, shapeToMove: SvgElement<T>): void;
  select(shape: SvgElement<T>): void;
  resize(shape: SvgElement<T>): void;
  drawHoverGuide(shape: SvgElement<T>): void;
  redrawHoverGuide(shape: SvgElement<T>): void;
  unselectAllShapes(): void;
}
