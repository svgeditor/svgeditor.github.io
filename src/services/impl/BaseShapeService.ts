import { MOVE_SHAPE_IN_PROGRESS_CLASS_NAME } from '../../constants/constants';
import { IShapeService } from '../api/IShapeService';
import { IAppStateService } from '../api/IAppStateService';
import { Position } from '../../models/Position';
import { ShapeInfo } from '../../models/ShapeInfo';
import { G } from '@svgdotjs/svg.js';

export abstract class BaseShapeService implements IShapeService {
  abstract createOnMouseDown(event: MouseEvent): void;
  abstract getStyles(): string;
  abstract select(shape: ShapeInfo): void;
  abstract resize(shape: ShapeInfo): void;

  private mousePosition: Position;
  private shapeToMoveContainer: G;
  private moveInProgressFlag: boolean;

  constructor(protected appStateService: IAppStateService) {
    this.moveInProgress = this.moveInProgress.bind(this);
    this.endMove = this.endMove.bind(this);
  }

  move(event: MouseEvent, shapeToMove: ShapeInfo): void {
    this.select(shapeToMove);
    this.moveInProgressFlag = false;
    this.mousePosition = { x: event.clientX, y: event.clientY };
    this.shapeToMoveContainer = shapeToMove.container;
    document.addEventListener('mousemove', this.moveInProgress);
    document.addEventListener('mouseup', this.endMove);
  }

  private moveInProgress(event: MouseEvent): void {
    if (!this.moveInProgressFlag) this.appStateService.getSvgRootElement().addClass(MOVE_SHAPE_IN_PROGRESS_CLASS_NAME);
    this.moveInProgressFlag = true;
    event.preventDefault();
    let previousMousePosition = { ...this.mousePosition };
    this.mousePosition = { x: event.clientX, y: event.clientY };
    const x = this.shapeToMoveContainer.x() + (this.mousePosition.x - previousMousePosition.x);
    const y = this.shapeToMoveContainer.y() + (this.mousePosition.y - previousMousePosition.y);
    this.shapeToMoveContainer.move(x, y);
  }

  private endMove(): void {
    this.appStateService.getSvgRootElement().removeClass(MOVE_SHAPE_IN_PROGRESS_CLASS_NAME);
    document.removeEventListener('mousemove', this.moveInProgress);
    document.removeEventListener('mouseup', this.endMove);
  }
}
