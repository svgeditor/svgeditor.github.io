import { G, Shape, Svg } from '@svgdotjs/svg.js';
import { Position } from '../api/Position';
import { IMoveService } from '../api/IMoveService';
import { MOVE_IN_PROGRESS_CLASS_NAME } from './_constants';

export class MoveService implements IMoveService {
  private mousePosition: Position;
  private svg: Svg;
  private shape: Shape;
  private moved: boolean;

  constructor() {
    this.move = this.move.bind(this);
    this.endMove = this.endMove.bind(this);
  }

  moveElement(event: MouseEvent, svg: Svg, shape: Shape): void {
    this.moved = false;
    this.svg = svg;
    this.mousePosition = { x: event.clientX, y: event.clientY };
    this.shape = <G>shape.parent();
    document.addEventListener('mousemove', this.move);
    document.addEventListener('mouseup', this.endMove);
  }

  private move(event: MouseEvent): void {
    if (!this.moved) this.svg.addClass(MOVE_IN_PROGRESS_CLASS_NAME);
    this.moved = true;
    event.preventDefault();
    let previousMousePosition = { ...this.mousePosition };
    this.mousePosition = { x: event.clientX, y: event.clientY };
    const x = this.shape.x() + (this.mousePosition.x - previousMousePosition.x);
    const y = this.shape.y() + (this.mousePosition.y - previousMousePosition.y);
    this.shape.move(x, y);
  }

  private endMove(event: MouseEvent): void {
    this.svg.removeClass(MOVE_IN_PROGRESS_CLASS_NAME);
    document.removeEventListener('mousemove', this.move);
    document.removeEventListener('mouseup', this.endMove);
  }
}
