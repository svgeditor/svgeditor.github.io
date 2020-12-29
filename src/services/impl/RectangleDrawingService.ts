import * as constants from '../../constants/constants';
import { IShapeDrawingService } from '../api/IShapeDrawingService';
import { AppStateService } from './AppStateService';
import { BaseShapeDrawingService } from './BaseShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { RectangleInfo, ShapeInfo } from '../../models/ShapeInfo';
import { UserActions } from '../../models/user-actions/UserActions';
import { Position } from '../../models/Position';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { Rect } from '@svgdotjs/svg.js';

export class RectangleDrawingService extends BaseShapeDrawingService<Rect> implements IShapeDrawingService<Rect> {
  private static instance: IShapeDrawingService<Rect> = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppStateService.getInstance(), whiteboardDrawingService);
    this.createOnMouseDownInProgress = this.createOnMouseDownInProgress.bind(this);
    this.endCreateOnMouseDown = this.endCreateOnMouseDown.bind(this);
  }

  static getInstance(whiteboardDrawingService: WhiteboardDrawingService): IShapeDrawingService<Rect> {
    if (RectangleDrawingService.instance == null) {
      RectangleDrawingService.instance = new RectangleDrawingService(whiteboardDrawingService);
    }
    return RectangleDrawingService.instance;
  }

  private initialPosition: Position;
  private shape: RectangleInfo;

  resize(shape: RectangleInfo): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const newX = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.x());
    const newY = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.y());
    const newW = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.width());
    const newH = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.height());
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('stroke-width'));
    shape.shape.move(newX, newY).size(newW, newH).attr('stroke-width', strokeWidth);
  }

  // prettier-ignore
  createOnMouseDown(event: MouseEvent): void {
    const svg = this.appStateService.getSvgRootElement();
    const container = svg.group().addClass(constants.SHAPE_GROUP_CLASS_NAME);
    const shape = svg.rect();
    this.initialPosition = { x: event.offsetX, y: event.offsetY };
    container.add(shape);
    shape
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(event.offsetX, event.offsetY)
      .size(0, 0)
      .fill('white')
      .stroke({color: '#707070', width: this.getZoomedValue()});
    document.addEventListener('mousemove', this.createOnMouseDownInProgress);
    document.addEventListener('mouseup', this.endCreateOnMouseDown);
    this.shape = new ShapeInfo(container, shape);
  }

  private createOnMouseDownInProgress(event: MouseEvent): void {
    event.preventDefault();
    const x = Math.min(event.offsetX, this.initialPosition.x);
    const y = Math.min(event.offsetY, this.initialPosition.y);
    const width = Math.abs(event.offsetX - this.initialPosition.x);
    const height = Math.abs(event.offsetY - this.initialPosition.y);
    this.shape.shape.move(x, y).size(width, height);
  }

  // prettier-ignore
  private endCreateOnMouseDown(event: MouseEvent) {
    if (this.shape.shape.width() == 0 || this.shape.shape.height() == 0) {
      this.shape.container.remove();
    } else {
      document.dispatchEvent(UserActions.createCustomEvent(new AddShape(this.shape)));
      this.drawOnHoverGuide(this.shape);
      setTimeout(() => this.select(this.shape), 0);
    }
    document.removeEventListener('mousemove', this.createOnMouseDownInProgress);
    document.removeEventListener('mouseup', this.endCreateOnMouseDown);
  }
}
