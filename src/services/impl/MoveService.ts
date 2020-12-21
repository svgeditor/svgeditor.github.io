import { G, Shape } from '@svgdotjs/svg.js';
import { Position } from '../api/Position';
import { IMoveService } from '../api/IMoveService';

export class MoveService implements IMoveService {
  private mousePosition: Position;
  private shape: Shape;

  constructor() {
    this.move = this.move.bind(this);
    this.endMove = this.endMove.bind(this);
  }

  moveElement(event: MouseEvent, shape: Shape): void {
    this.mousePosition = { x: event.clientX, y: event.clientY };
    this.shape = <G>shape.parent();
    document.addEventListener('mousemove', this.move);
    document.addEventListener('mouseup', this.endMove);
  }

  private move(event: MouseEvent): void {
    event.preventDefault();
    let previousMousePosition = { ...this.mousePosition };
    this.mousePosition = { x: event.clientX, y: event.clientY };
    const x = this.shape.x() + (this.mousePosition.x - previousMousePosition.x);
    const y = this.shape.y() + (this.mousePosition.y - previousMousePosition.y);
    this.shape.move(x, y);
  }

  private endMove(event: MouseEvent): void {
    document.removeEventListener('mousemove', this.move);
    document.removeEventListener('mouseup', this.endMove);
  }
}
