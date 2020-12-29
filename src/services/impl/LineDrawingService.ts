import { Line, Shape } from '@svgdotjs/svg.js';
import * as constants from '../../constants/constants';
import { IShapeDrawingService } from '../api/IShapeDrawingService';
import { AppStateService } from './AppStateService';
import { BaseShapeDrawingService } from './BaseShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { ShapeInfo } from '../../models/ShapeInfo';
import { UserActions } from '../../models/user-actions/UserActions';
import { Position } from '../../models/Position';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { SelectShape } from '../../models/user-actions/SelectShape';

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

  select(shape: ShapeInfo): void {
    this.whiteboardDrawingService.unselectAll();
    shape.container.addClass(constants.SELECTED_SHAPE_CLASS_NAME);
    const group = this.whiteboardDrawingService.getSelectedShapesGroup();
    group.add(this.createLineBorder(shape));
    group.add(this.createResizeGuideP1(shape));
    group.add(this.createResizeGuideP2(shape));
    group.front();
    document.dispatchEvent(UserActions.createCustomEvent(new SelectShape(shape)));
  }

  private createLineBorder(shape: ShapeInfo): Shape {
    const line = shape.shape as Line;
    return this.appStateService
      .getSvgRootElement()
      .line(line.array())
      .move(line.x(), line.y())
      .addClass(constants.SELECTED_SHAPE_BORDER_CLASS_NAME)
      .stroke({ color: constants.SELECTION_COLOR, width: 1 });
  }

  createResizeGuideP1(shape: ShapeInfo): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const line = shape.shape as Line;
    const x = line.attr('x1');
    const y = line.attr('y1');
    const circle = this.createResizeGuide(x, y);
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const handleMouseMove = (event) => {
        event.preventDefault();
        const newX = event.offsetX;
        const newY = event.offsetY;
        line.attr('x1', newX).attr('y1', newY);
      };
      const handleMouseUp = () => {
        _this.redrawOnHoverGuide(shape);
        _this.select(shape);
        svg.removeClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  createResizeGuideP2(shape: ShapeInfo): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const line = shape.shape as Line;
    const x = line.attr('x2');
    const y = line.attr('y2');
    const circle = this.createResizeGuide(x, y);
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const handleMouseMove = (event) => {
        event.preventDefault();
        const newX = event.offsetX;
        const newY = event.offsetY;
        line.attr('x2', newX).attr('y2', newY);
      };
      const handleMouseUp = () => {
        _this.select(shape);
        _this.redrawOnHoverGuide(shape);
        svg.removeClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
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
      this.drawOnHoverGuide(this.shape);
      setTimeout(() => this.select(this.shape), 0);
    }
    document.removeEventListener('mousemove', this.createOnMouseDownInProgress);
    document.removeEventListener('mouseup', this.endCreateOnMouseDown);
  }
}
