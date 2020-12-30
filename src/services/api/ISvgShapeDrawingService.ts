import { Shape } from '@svgdotjs/svg.js';
import { SvgShape } from '../../models/SvgShape';

export interface ISvgShapeDrawingService<T extends SvgShape<Shape>> {
  draw(event: MouseEvent): void;
  move(event: MouseEvent, shapeToMove: T): void;
  select(element: T): void;
  resize(element: T): void;
  drawHoverGuide(element: T): void;
  redrawHoverGuide(element: T): void;
  unselectAllShapes(): void;
}
