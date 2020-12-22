import { G, Shape } from '@svgdotjs/svg.js';
import { MOVE_IN_PROGRESS_CLASS_NAME, SELECTABLE_BORDER_GROUP_CLASS_NAME } from './_constants';
import { ISvgElementService } from '../api/ISvgElementService';
import { IAppStateService } from '../api/IAppStateService';
import { Position } from '../../models/Position';

export abstract class SvgElementService implements ISvgElementService {
  abstract createOnMouseDown(event: MouseEvent): void;
  abstract getStyles(): string;
  abstract select(shape: Shape): void;

  private group = null;
  private mousePosition: Position;
  private shapeToMove: Shape;
  private moveInProgressFlag: boolean;

  constructor(protected appStateService: IAppStateService) {
    this.moveInProgress = this.moveInProgress.bind(this);
    this.endMove = this.endMove.bind(this);
  }

  unselectAll(): void {
    this.getGroup().each(function () {
      this.remove();
    });
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

  protected getGroup(): G {
    if (this.group) return this.group;
    const svg = this.appStateService.getSvg();
    this.group = svg.findOne(`g.${SELECTABLE_BORDER_GROUP_CLASS_NAME}`);
    if (!this.group) this.group = svg.group().addClass(`${SELECTABLE_BORDER_GROUP_CLASS_NAME}`);
    return this.group;
  }
}
