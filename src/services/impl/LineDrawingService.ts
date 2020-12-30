import { Line, Shape } from '@svgdotjs/svg.js';
import * as constants from '../../constants/constants';
import { IShapeDrawingService } from '../api/IShapeDrawingService';
import { AppStateService } from './AppStateService';
import { BaseShapeDrawingService } from './BaseShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { SvgLine, SvgElement } from '../../models/SvgElement';
import { UserActions } from '../../models/user-actions/UserActions';
import { Position } from '../../models/Position';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { SelectShape } from '../../models/user-actions/SelectShape';

export class LineDrawingService extends BaseShapeDrawingService<Line> implements IShapeDrawingService<Line> {
  private static instance: IShapeDrawingService<Line> = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppStateService.getInstance(), whiteboardDrawingService);
    this.createOnMouseDownInProgress = this.createOnMouseDownInProgress.bind(this);
    this.endCreateOnMouseDown = this.endCreateOnMouseDown.bind(this);
  }

  static getInstance(whiteboardDrawingService: WhiteboardDrawingService): IShapeDrawingService<Line> {
    if (LineDrawingService.instance == null) {
      LineDrawingService.instance = new LineDrawingService(whiteboardDrawingService);
    }
    return LineDrawingService.instance;
  }

  private initialPosition: Position;
  private shape: SvgLine;

  // prettier-ignore
  draw(event: MouseEvent): void {
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
    this.shape = new SvgElement(container, shape);
  }

  resize(shape: SvgLine): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const line = shape.element;
    const newX1 = zoomLevel.getZoomedValueFromPreviousValue(line.attr('x1'));
    const newY1 = zoomLevel.getZoomedValueFromPreviousValue(line.attr('y1'));
    const newX2 = zoomLevel.getZoomedValueFromPreviousValue(line.attr('x2'));
    const newY2 = zoomLevel.getZoomedValueFromPreviousValue(line.attr('y2'));
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(line.attr('stroke-width'));
    line.attr('x1', newX1).attr('y1', newY1).attr('x2', newX2).attr('y2', newY2).attr('stroke-width', strokeWidth);
  }

  select(shape: SvgLine): void {
    this.whiteboardDrawingService.unselectAllShapes();
    shape.container.addClass(constants.SELECTED_SHAPE_CLASS_NAME);
    const group = this.whiteboardDrawingService.getSelectedShapesGroup();
    group.add(this.createLineBorder(shape));
    group.add(this.createLineResizeGuide(shape, 'x1', 'y1'));
    group.add(this.createLineResizeGuide(shape, 'x2', 'y2'));
    group.front();
    document.dispatchEvent(UserActions.createCustomEvent(new SelectShape(shape)));
  }

  private createLineBorder(shape: SvgLine): Shape {
    const line = shape.element;
    return this.appStateService
      .getSvgRootElement()
      .line(line.array())
      .move(line.x(), line.y())
      .addClass(constants.SELECTED_SHAPE_BORDER_CLASS_NAME)
      .stroke({ color: constants.SELECTION_BORDER_COLOR, width: 1 });
  }

  private createLineResizeGuide(shape: SvgLine, xAttributeName: string, yAttributeName: string): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const line = shape.element as Line;
    const x = line.attr(xAttributeName);
    const y = line.attr(yAttributeName);
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
        line.attr(xAttributeName, newX).attr(yAttributeName, newY);
      };
      const handleMouseUp = () => {
        _this.redrawHoverGuide(shape);
        _this.unselectAllShapes();
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

  private createOnMouseDownInProgress(event: MouseEvent): void {
    event.preventDefault();
    const x = event.offsetX;
    const y = event.offsetY;
    (this.shape.element as Line).plot(this.initialPosition.x, this.initialPosition.y, x, y);
  }

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
