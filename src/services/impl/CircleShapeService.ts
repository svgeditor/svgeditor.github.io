import { Circle } from '@svgdotjs/svg.js';
import * as constants from '../../constants/constants';
import { IShapeService } from '../api/IShapeService';
import { AppStateService } from './AppStateService';
import { BaseShapeService } from './BaseShapeService';
import { AddShape } from '../../models/user-actions/AddShape';
import { ShapeInfo } from '../../models/ShapeInfo';
import { UserActions } from '../../models/user-actions/UserActions';
import { Position } from '../../models/Position';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';

export class CircleShapeService extends BaseShapeService implements IShapeService {
  private static instance: IShapeService = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppStateService.getInstance(), whiteboardDrawingService);
    this.createOnMouseDownInProgress = this.createOnMouseDownInProgress.bind(this);
    this.endCreateOnMouseDown = this.endCreateOnMouseDown.bind(this);
  }

  static getInstance(whiteboardDrawingService: WhiteboardDrawingService): IShapeService {
    if (CircleShapeService.instance == null) {
      CircleShapeService.instance = new CircleShapeService(whiteboardDrawingService);
    }
    return CircleShapeService.instance;
  }

  private initialPosition: Position;
  private shape: ShapeInfo;

  // prettier-ignore
  createOnMouseDown(event: MouseEvent): void {
    const svg = this.appStateService.getSvgRootElement();
    const container = svg.group().addClass(constants.SHAPE_GROUP_CLASS_NAME);
    this.initialPosition = { x: event.offsetX, y: event.offsetY };
    const shape = svg.circle(0).move(this.initialPosition.x, this.initialPosition.y);
    container.add(shape);
    shape
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(event.offsetX, event.offsetY)
      .fill('white')
      .stroke({color: '#707070', width: this.getZoomedValue()});
    document.addEventListener('mousemove', this.createOnMouseDownInProgress);
    document.addEventListener('mouseup', this.endCreateOnMouseDown);
    this.shape = new ShapeInfo(container, shape);
  }

  resize(shape: ShapeInfo): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const newCx = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.cx());
    const newCy = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.cy());
    const newRadius = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('r'));
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('stroke-width'));
    shape.shape.center(newCx, newCy).attr('r', newRadius).attr('stroke-width', strokeWidth);
  }

  private createOnMouseDownInProgress(event: MouseEvent): void {
    event.preventDefault();
    const x = (event.offsetX + this.initialPosition.x) / 2;
    const y = (event.offsetY + this.initialPosition.y) / 2;
    const width = Math.abs(event.offsetX - this.initialPosition.x);
    const height = Math.abs(event.offsetY - this.initialPosition.y);
    const radius = Math.max(width / 2, height / 2);
    (this.shape.shape as Circle).radius(radius).center(x, y);
  }

  // prettier-ignore
  private endCreateOnMouseDown(event: MouseEvent) {
    if (this.shape.shape.width() == 0 || this.shape.shape.height() == 0) {
      this.shape.container.remove();
    } else {
      document.dispatchEvent(UserActions.createCustomEvent(new AddShape(this.shape)));
      this.shape.container.add(this.shape.shape.clone()
        .removeClass(constants.SHAPE_CLASS_NAME)
        .addClass(constants.HOVER_SHAPE_CLASS_NAME)
        .fill('transparent')
        .stroke({ color: constants.SELECTION_COLOR, width: 1 }));
      setTimeout(() => this.select(this.shape), 0);
    }
    document.removeEventListener('mousemove', this.createOnMouseDownInProgress);
    document.removeEventListener('mouseup', this.endCreateOnMouseDown);
  }
}
