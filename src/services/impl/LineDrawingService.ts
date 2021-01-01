import { Line, Shape } from '@svgdotjs/svg.js';
import * as constants from '../../constants/constants';
import { ISvgShapeDrawingService } from '../api/ISvgShapeDrawingService';
import { AppStateService } from './AppStateService';
import { BaseSvgShapeDrawingService } from './BaseSvgShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { SvgLine } from '../../models/SvgShape';
import { UserActions } from '../../models/user-actions/UserActions';
import { Position } from '../../models/Position';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { RandomIdService } from './RandomIdService';

export class LineDrawingService extends BaseSvgShapeDrawingService<SvgLine> implements ISvgShapeDrawingService<SvgLine> {
  private static instance: ISvgShapeDrawingService<SvgLine> = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppStateService.getInstance(), whiteboardDrawingService, RandomIdService.getInstance());
  }

  static getInstance(whiteboardDrawingService: WhiteboardDrawingService): ISvgShapeDrawingService<SvgLine> {
    if (LineDrawingService.instance == null) {
      LineDrawingService.instance = new LineDrawingService(whiteboardDrawingService);
    }
    return LineDrawingService.instance;
  }

  // prettier-ignore
  draw(event: MouseEvent): void {
    const _this = this;
    const initialPosition = { x: event.offsetX, y: event.offsetY };
    const container = _this.createContainer();
    const line = _this.createLine(initialPosition);
    const shape = new SvgLine(container, line);
    container.add(line);

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      const x = event.offsetX;
      const y = event.offsetY;
      line.plot(initialPosition.x, initialPosition.y, x, y);
    };

    const onMouseUp = () => {
      if (line.width() == 0 || line.height() == 0) {
        container.remove();
      } else {
        document.dispatchEvent(UserActions.createCustomEvent(new AddShape(shape)));
        _this.drawHoverGuide(shape);
        setTimeout(() => {
          _this.whiteboardDrawingService.unselectAllShapesToSelectNewShape();
          _this.whiteboardDrawingService.select([shape]);
        }, 0);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  resize(line: SvgLine): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const newX1 = zoomLevel.getZoomedValueFromPreviousValue(line.getShape().attr('x1'));
    const newY1 = zoomLevel.getZoomedValueFromPreviousValue(line.getShape().attr('y1'));
    const newX2 = zoomLevel.getZoomedValueFromPreviousValue(line.getShape().attr('x2'));
    const newY2 = zoomLevel.getZoomedValueFromPreviousValue(line.getShape().attr('y2'));
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(line.getShape().attr('stroke-width'));
    line.getShape().attr('x1', newX1).attr('y1', newY1).attr('x2', newX2).attr('y2', newY2).attr('stroke-width', strokeWidth);
  }

  select(line: SvgLine): void {
    line.getContainer().addClass(constants.SELECTED_SHAPE_GROUP_CLASS_NAME);
    const group = this.whiteboardDrawingService.getSelectedShapesGroup();
    group.add(this.createLineBorder(line));
    group.add(this.createLineResizeGuide(line, 'x1', 'y1'));
    group.add(this.createLineResizeGuide(line, 'x2', 'y2'));
    group.front();
  }

  private createLineBorder(line: SvgLine): Shape {
    return this.appStateService
      .getSvgRootElement()
      .line(line.getShape().array())
      .move(line.getShape().x(), line.getShape().y())
      .addClass(constants.SELECTED_SHAPE_BORDER_CLASS_NAME)
      .stroke({ color: constants.SELECTION_BORDER_COLOR, width: 1 });
  }

  private createLineResizeGuide(line: SvgLine, xAttributeName: string, yAttributeName: string): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const x = line.getShape().attr(xAttributeName);
    const y = line.getShape().attr(yAttributeName);
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
        line.getShape().attr(xAttributeName, newX).attr(yAttributeName, newY);
      };
      const handleMouseUp = () => {
        _this.redrawHoverGuide(line);
        _this.unselectAllShapes();
        _this.whiteboardDrawingService.select([line]);
        svg.removeClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  private createLine(position: Position): Line {
    return this.appStateService
      .getSvgRootElement()
      .line(position.x, position.y, position.x, position.y)
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(position.x, position.y)
      .fill('white')
      .stroke({ color: '#707070', width: this.getZoomedValue() });
  }
}
