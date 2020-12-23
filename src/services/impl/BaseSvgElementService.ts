import { G, Shape } from '@svgdotjs/svg.js';
import { MOVE_IN_PROGRESS_CLASS_NAME, SELECTION_GROUP_CLASS_NAME } from './_constants';
import { ISvgElementService } from '../api/ISvgElementService';
import { IAppStateService } from '../api/IAppStateService';
import { Position } from '../../models/Position';
import { ZoomPercentage } from '../../models/ZoomPercentage';

export abstract class SvgElementService implements ISvgElementService {
  abstract createOnMouseDown(event: MouseEvent): void;
  abstract getStyles(): string;
  abstract select(shape: Shape): void;
  abstract resize(shape: Shape): void;
  abstract resize(shape: Shape, zoomPercentage: ZoomPercentage): void;

  private mousePosition: Position;
  private shapeToMove: Shape;
  private moveInProgressFlag: boolean;

  constructor(protected appStateService: IAppStateService) {
    this.moveInProgress = this.moveInProgress.bind(this);
    this.endMove = this.endMove.bind(this);
  }

  move(event: MouseEvent, shapeToMove: Shape): void {
    this.select(shapeToMove);
    this.moveInProgressFlag = false;
    this.mousePosition = { x: event.clientX, y: event.clientY };
    this.shapeToMove = shapeToMove;
    document.addEventListener('mousemove', this.moveInProgress);
    document.addEventListener('mouseup', this.endMove);
  }

  private moveInProgress(event: MouseEvent): void {
    if (!this.moveInProgressFlag) this.appStateService.getSvg().addClass(MOVE_IN_PROGRESS_CLASS_NAME);
    this.moveInProgressFlag = true;
    event.preventDefault();
    let previousMousePosition = { ...this.mousePosition };
    this.mousePosition = { x: event.clientX, y: event.clientY };
    const x = this.shapeToMove.x() + (this.mousePosition.x - previousMousePosition.x);
    const y = this.shapeToMove.y() + (this.mousePosition.y - previousMousePosition.y);
    this.shapeToMove.move(x, y);
  }

  private endMove(): void {
    this.appStateService.getSvg().removeClass(MOVE_IN_PROGRESS_CLASS_NAME);
    document.removeEventListener('mousemove', this.moveInProgress);
    document.removeEventListener('mouseup', this.endMove);
  }
}
