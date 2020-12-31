import * as constants from '../../constants/constants';
import { ISvgShapeDrawingService } from '../api/ISvgShapeDrawingService';
import { AppStateService } from './AppStateService';
import { BaseSvgShapeDrawingService } from './BaseSvgShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { SvgRectangle } from '../../models/SvgShape';
import { UserActions } from '../../models/user-actions/UserActions';
import { Position } from '../../models/Position';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { Rect } from '@svgdotjs/svg.js';

export class RectangleDrawingService extends BaseSvgShapeDrawingService<SvgRectangle> implements ISvgShapeDrawingService<SvgRectangle> {
  private static instance: ISvgShapeDrawingService<SvgRectangle> = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppStateService.getInstance(), whiteboardDrawingService);
  }

  static getInstance(whiteboardDrawingService: WhiteboardDrawingService): ISvgShapeDrawingService<SvgRectangle> {
    if (RectangleDrawingService.instance == null) {
      RectangleDrawingService.instance = new RectangleDrawingService(whiteboardDrawingService);
    }
    return RectangleDrawingService.instance;
  }

  draw(event: MouseEvent): void {
    const _this = this;
    const initialPosition = { x: event.offsetX, y: event.offsetY };
    const container = _this.createContainer();
    const rectangle = this.createRectangle(initialPosition);
    const shape = new SvgRectangle(container, rectangle);
    container.add(rectangle);

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      const x = Math.min(event.offsetX, initialPosition.x);
      const y = Math.min(event.offsetY, initialPosition.y);
      const width = Math.abs(event.offsetX - initialPosition.x);
      const height = Math.abs(event.offsetY - initialPosition.y);
      rectangle.move(x, y).size(width, height);
    };

    const onMouseUp = () => {
      if (rectangle.width() == 0 || rectangle.height() == 0) {
        container.remove();
      } else {
        document.dispatchEvent(UserActions.createCustomEvent(new AddShape(shape)));
        _this.drawHoverGuide(shape);
        setTimeout(() => _this.whiteboardDrawingService.select([shape]), 0);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  resize(shape: SvgRectangle): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const newX = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.x());
    const newY = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.y());
    const newW = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.width());
    const newH = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.height());
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('stroke-width'));
    shape.shape.move(newX, newY).size(newW, newH).attr('stroke-width', strokeWidth);
  }

  private createRectangle(position: Position): Rect {
    return this.appStateService
      .getSvgRootElement()
      .rect(0)
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(position.x, position.y)
      .fill('white')
      .stroke({ color: '#707070', width: this.getZoomedValue() });
  }
}
