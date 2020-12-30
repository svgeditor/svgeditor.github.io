import { Ellipse } from '@svgdotjs/svg.js';
import * as constants from '../../constants/constants';
import { IShapeDrawingService } from '../api/IShapeDrawingService';
import { AppStateService } from './AppStateService';
import { BaseShapeDrawingService } from './BaseShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { SvgEllipse, SvgElement } from '../../models/SvgElement';
import { UserActions } from '../../models/user-actions/UserActions';
import { Position } from '../../models/Position';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';

export class EllipseDrawingService extends BaseShapeDrawingService<Ellipse> implements IShapeDrawingService<Ellipse> {
  private static instance: IShapeDrawingService<Ellipse> = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppStateService.getInstance(), whiteboardDrawingService);
    this.createOnMouseDownInProgress = this.createOnMouseDownInProgress.bind(this);
    this.endCreateOnMouseDown = this.endCreateOnMouseDown.bind(this);
  }

  static getInstance(whiteboardDrawingService: WhiteboardDrawingService): IShapeDrawingService<Ellipse> {
    if (EllipseDrawingService.instance == null) {
      EllipseDrawingService.instance = new EllipseDrawingService(whiteboardDrawingService);
    }
    return EllipseDrawingService.instance;
  }

  private initialPosition: Position;
  private shape: SvgEllipse;

  // prettier-ignore
  draw(event: MouseEvent): void {
    const svg = this.appStateService.getSvgRootElement();
    const container = svg.group().addClass(constants.SHAPE_GROUP_CLASS_NAME);
    this.initialPosition = { x: event.offsetX, y: event.offsetY };
    const shape = svg.ellipse(0).move(this.initialPosition.x, this.initialPosition.y);
    container.add(shape);
    shape
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(event.offsetX, event.offsetY)
      .fill('white')
      .stroke({color: '#707070', width: this.getZoomedValue()});
    document.addEventListener('mousemove', this.createOnMouseDownInProgress);
    document.addEventListener('mouseup', this.endCreateOnMouseDown);
    this.shape = new SvgElement(container, shape);
  }

  resize(shape: SvgEllipse): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const newCx = zoomLevel.getZoomedValueFromPreviousValue(shape.element.cx());
    const newCy = zoomLevel.getZoomedValueFromPreviousValue(shape.element.cy());
    const newRx = zoomLevel.getZoomedValueFromPreviousValue(shape.element.attr('rx'));
    const newRy = zoomLevel.getZoomedValueFromPreviousValue(shape.element.attr('ry'));
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(shape.element.attr('stroke-width'));
    shape.element.center(newCx, newCy).attr('rx', newRx).attr('ry', newRy).attr('stroke-width', strokeWidth);
  }

  private createOnMouseDownInProgress(event: MouseEvent): void {
    event.preventDefault();
    const x = (event.offsetX + this.initialPosition.x) / 2;
    const y = (event.offsetY + this.initialPosition.y) / 2;
    const width = Math.abs(event.offsetX - this.initialPosition.x) / 2;
    const height = Math.abs(event.offsetY - this.initialPosition.y) / 2;
    const radius = Math.max(width / 2, height / 2);
    this.shape.element.center(x, y).radius(width, height);
  }

  // prettier-ignore
  private endCreateOnMouseDown(event: MouseEvent) {
    if (this.shape.element.width() == 0 || this.shape.element.height() == 0) {
      this.shape.container.remove();
    } else {
      document.dispatchEvent(UserActions.createCustomEvent(new AddShape(this.shape)));
      this.drawHoverGuide(this.shape);
      setTimeout(() => this.select(this.shape), 0);
    }
    document.removeEventListener('mousemove', this.createOnMouseDownInProgress);
    document.removeEventListener('mouseup', this.endCreateOnMouseDown);
  }
}
