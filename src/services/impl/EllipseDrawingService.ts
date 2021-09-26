import { Ellipse, Svg } from '@svgdotjs/svg.js';
import * as constants from '../../constants/constants';
import { ISvgShapeDrawingService } from '../ISvgShapeDrawingService';
import { BaseSvgShapeDrawingService } from './BaseSvgShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { UserActions } from '../../models/user-actions/UserActions';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { Position } from '../../models/Position';
import { RandomIdGenerator } from './RandomIdGenerator';
import { SvgEllipse } from '../../models/svg-elements/SvgShape';
import { AppState } from '../../models/app-state/AppState';

export class EllipseDrawingService extends BaseSvgShapeDrawingService<SvgEllipse> implements ISvgShapeDrawingService<SvgEllipse> {
  private static instance: ISvgShapeDrawingService<SvgEllipse> = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppState.getInstance(), whiteboardDrawingService, RandomIdGenerator.getInstance());
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
    this.whiteboardDrawingService.unselectAllShapes();
    const initialPosition = new Position(event.offsetX, event.offsetY);
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
        setTimeout(() => {
          _this.whiteboardDrawingService.select([shape]);
        }, 0);
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  resize(ellipse: SvgEllipse): void {
    const zoomLevel = this.appState.getZoomLevel();
    const newCx = zoomLevel.getZoomedValueFromPreviousValue(ellipse.getShape().cx());
    const newCy = zoomLevel.getZoomedValueFromPreviousValue(ellipse.getShape().cy());
    const newRx = zoomLevel.getZoomedValueFromPreviousValue(ellipse.getShape().attr('rx'));
    const newRy = zoomLevel.getZoomedValueFromPreviousValue(ellipse.getShape().attr('ry'));
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(ellipse.getShape().attr('stroke-width'));
    ellipse.getShape().center(newCx, newCy).attr('rx', newRx).attr('ry', newRy).attr('stroke-width', strokeWidth);
  }

  private createEllipse(position: Position): Ellipse {
    return new Svg()
      .ellipse(0)
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(position.x, position.y)
      .fill('white')
      .stroke({ color: '#707070', width: this.getZoomedValue() });
  }
}
