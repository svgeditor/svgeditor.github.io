import { Ellipse } from '@svgdotjs/svg.js';
import * as constants from '../../constants/constants';
import { ISvgShapeDrawingService } from '../api/ISvgShapeDrawingService';
import { AppStateService } from './AppStateService';
import { BaseSvgShapeDrawingService } from './BaseSvgShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { SvgEllipse } from '../../models/SvgShape';
import { UserActions } from '../../models/user-actions/UserActions';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { Position } from '../../models/Position';

export class EllipseDrawingService extends BaseSvgShapeDrawingService<SvgEllipse> implements ISvgShapeDrawingService<SvgEllipse> {
  private static instance: ISvgShapeDrawingService<SvgEllipse> = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppStateService.getInstance(), whiteboardDrawingService);
  }

  static getInstance(whiteboardDrawingService: WhiteboardDrawingService): ISvgShapeDrawingService<SvgEllipse> {
    if (EllipseDrawingService.instance == null) {
      EllipseDrawingService.instance = new EllipseDrawingService(whiteboardDrawingService);
    }
    return EllipseDrawingService.instance;
  }

  // prettier-ignore
  draw(event: MouseEvent): void {
    const _this = this;
    const initialPosition = { x: event.offsetX, y: event.offsetY };
    const container = _this.createContainer();
    const ellipse = _this.createEllipse(initialPosition);
    const shape = new SvgEllipse(container, ellipse);
    container.add(ellipse);

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      const x = (event.offsetX + initialPosition.x) / 2;
      const y = (event.offsetY + initialPosition.y) / 2;
      const width = Math.abs(event.offsetX - initialPosition.x) / 2;
      const height = Math.abs(event.offsetY - initialPosition.y) / 2;
      ellipse.center(x, y).radius(width, height);
    };

    const onMouseUp = () => {
      if (ellipse.width() == 0 || ellipse.height() == 0) {
        container.remove();
      } else {
        document.dispatchEvent(UserActions.createCustomEvent(new AddShape(shape)));
        _this.drawHoverGuide(shape);
        setTimeout(() => _this.select(shape), 0);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  resize(shape: SvgEllipse): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const newCx = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.cx());
    const newCy = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.cy());
    const newRx = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('rx'));
    const newRy = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('ry'));
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(shape.shape.attr('stroke-width'));
    shape.shape.center(newCx, newCy).attr('rx', newRx).attr('ry', newRy).attr('stroke-width', strokeWidth);
  }

  private createEllipse(position: Position): Ellipse {
    return this.appStateService
      .getSvgRootElement()
      .ellipse(0)
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(position.x, position.y)
      .fill('white')
      .stroke({ color: '#707070', width: this.getZoomedValue() });
  }
}