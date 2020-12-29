import { Line } from '@svgdotjs/svg.js';
import * as constants from '../../constants/constants';
import { IShapeDrawingService } from '../api/IShapeDrawingService';
import { AppStateService } from './AppStateService';
import { BaseShapeDrawingService } from './BaseShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { ShapeInfo } from '../../models/ShapeInfo';
import { UserActions } from '../../models/user-actions/UserActions';
import { Position } from '../../models/Position';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';

export class LineDrawingService extends BaseShapeDrawingService implements IShapeDrawingService {
  private static instance: IShapeDrawingService = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppStateService.getInstance(), whiteboardDrawingService);
    this.createOnMouseDownInProgress = this.createOnMouseDownInProgress.bind(this);
    this.endCreateOnMouseDown = this.endCreateOnMouseDown.bind(this);
  }

  static getInstance(whiteboardDrawingService: WhiteboardDrawingService): IShapeDrawingService {
    if (LineDrawingService.instance == null) {
      LineDrawingService.instance = new LineDrawingService(whiteboardDrawingService);
    }
    return LineDrawingService.instance;
  }

  private initialPosition: Position;
  private shape: ShapeInfo;

  // prettier-ignore
  createOnMouseDown(event: MouseEvent): void {
    const svg = this.appStateService.getSvgRootElement();
    const container = svg.group().addClass(constants.SHAPE_GROUP_CLASS_NAME);
    this.initialPosition = { x: event.offsetX, y: event.offsetY };
    const shape = svg
      .line(this.initialPosition.x, this.initialPosition.y, this.initialPosition.x, this.initialPosition.y)
      .move(this.initialPosition.x, this.initialPosition.y);
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
    const line = shape.shape as Line;
    const newX1 = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('x1'));
    const newY1 = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('y1'));
    const newX2 = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('x2'));
    const newY2 = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('y2'));
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('stroke-width'));
    line.attr('x1', newX1).attr('y1', newY1).attr('x2', newX2).attr('y2', newY2).attr('stroke-width', strokeWidth);
  }

  private createOnMouseDownInProgress(event: MouseEvent): void {
    event.preventDefault();
    const x = event.offsetX;
    const y = event.offsetY;
    (this.shape.shape as Line).plot(this.initialPosition.x, this.initialPosition.y, x, y);
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
