import { Circle } from '@svgdotjs/svg.js';
import * as constants from '../../constants/constants';
import { ISvgShapeDrawingService } from '../api/ISvgShapeDrawingService';
import { AppStateService } from './AppStateService';
import { BaseSvgShapeDrawingService } from './BaseSvgShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { SvgCircle } from '../../models/SvgShape';
import { UserActions } from '../../models/user-actions/UserActions';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { Position } from '../../models/Position';

export class CircleDrawingService extends BaseSvgShapeDrawingService<SvgCircle> implements ISvgShapeDrawingService<SvgCircle> {
  private static instance: ISvgShapeDrawingService<SvgCircle> = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppStateService.getInstance(), whiteboardDrawingService);
  }

  static getInstance(whiteboardDrawingService: WhiteboardDrawingService): ISvgShapeDrawingService<SvgCircle> {
    if (CircleDrawingService.instance == null) {
      CircleDrawingService.instance = new CircleDrawingService(whiteboardDrawingService);
    }
    return CircleDrawingService.instance;
  }

  draw(event: MouseEvent): void {
    const _this = this;
    const initialPosition = { x: event.offsetX, y: event.offsetY };
    const container = _this.createContainer();
    const circle = _this.createCircle(initialPosition);
    const shape = new SvgCircle(container, circle);
    container.add(circle);

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      const x = (event.offsetX + initialPosition.x) / 2;
      const y = (event.offsetY + initialPosition.y) / 2;
      const width = Math.abs(event.offsetX - initialPosition.x);
      const height = Math.abs(event.offsetY - initialPosition.y);
      const radius = Math.max(width / 2, height / 2);
      circle.radius(radius).center(x, y);
    };

    const onMouseUp = () => {
      if (circle.width() == 0 || circle.height() == 0) {
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

  resize(shape: SvgCircle): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const newCx = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.cx());
    const newCy = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.cy());
    const newRadius = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('r'));
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('stroke-width'));
    shape.shape.center(newCx, newCy).attr('r', newRadius).attr('stroke-width', strokeWidth);
  }

  private createCircle(position: Position): Circle {
    return this.appStateService
      .getSvgRootElement()
      .circle(0)
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(position.x, position.y)
      .fill('white')
      .stroke({ color: '#707070', width: this.getZoomedValue() });
  }
}
