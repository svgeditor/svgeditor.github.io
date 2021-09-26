import { Circle, Shape, Svg } from '@svgdotjs/svg.js';
import * as constants from '../../constants/constants';
import { ISvgShapeDrawingService } from '../ISvgShapeDrawingService';
import { BaseSvgShapeDrawingService } from './BaseSvgShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { UserActions } from '../../models/user-actions/UserActions';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { Position } from '../../models/Position';
import { RandomIdGenerator } from './RandomIdGenerator';
import { SvgCircle } from '../../models/svg-elements/SvgShape';
import { AppState } from '../../models/app-state/AppState';

export class CircleDrawingService extends BaseSvgShapeDrawingService<SvgCircle> implements ISvgShapeDrawingService<SvgCircle> {
  private static instance: ISvgShapeDrawingService<SvgCircle> = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppState.getInstance(), whiteboardDrawingService, RandomIdGenerator.getInstance());
  }

  static getInstance(whiteboardDrawingService: WhiteboardDrawingService): ISvgShapeDrawingService<SvgCircle> {
    if (CircleDrawingService.instance == null) {
      CircleDrawingService.instance = new CircleDrawingService(whiteboardDrawingService);
    }
    return CircleDrawingService.instance;
  }

  draw(event: MouseEvent): void {
    const _this = this;
    this.whiteboardDrawingService.unselectAllShapes();
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

  resize(circle: SvgCircle): void {
    const zoomLevel = this.appState.getZoomLevel();
    const newCx = zoomLevel.getZoomedValueFromPreviousValue(circle.getShape().cx());
    const newCy = zoomLevel.getZoomedValueFromPreviousValue(circle.getShape().cy());
    const newRadius = zoomLevel.getZoomedValueFromPreviousValue(circle.getShape().attr('r'));
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(circle.getShape().attr('stroke-width'));
    circle.getShape().center(newCx, newCy).attr('r', newRadius).attr('stroke-width', strokeWidth);
  }

  // prettier-ignore
  protected createResizeGuideNW(shape: SvgCircle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(shape.getContainer().x(), shape.getContainer().y());
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.getContainer().x() + shape.getContainer().width();
      const shapeInitialY = shape.getContainer().y() + shape.getContainer().height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        const radius = Math.max(width / 2, height / 2);
        const cx = event.offsetX < shapeInitialX  ? shapeInitialX - radius : shapeInitialX + radius;
        const cy = event.offsetY < shapeInitialY ? shapeInitialY - radius : shapeInitialY + radius;
        shape.getContainer().each(function () {
          this.radius(radius).center(cx, cy);
        });
      };
      const handleMouseUp = () => {
        _this.unselectAllShapes();
        _this.whiteboardDrawingService.select([shape]);
        svg.removeClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  protected createResizeGuideNE(shape: SvgCircle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(shape.getContainer().x() + shape.getContainer().width(), shape.getContainer().y());
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nesw-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.getContainer().x();
      const shapeInitialY = shape.getContainer().y() + shape.getContainer().height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        const radius = Math.max(width / 2, height / 2);
        const cx = event.offsetX < shapeInitialX ? shapeInitialX - radius : shapeInitialX + radius;
        const cy = event.offsetY < shapeInitialY ? shapeInitialY - radius : shapeInitialY + radius;
        shape.getContainer().each(function () {
          this.radius(radius).center(cx, cy);
        });
      };
      const handleMouseUp = () => {
        _this.unselectAllShapes();
        _this.whiteboardDrawingService.select([shape]);
        svg.removeClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  protected createResizeGuideSE(shape: SvgCircle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(
      shape.getContainer().x() + shape.getContainer().width(),
      shape.getContainer().y() + shape.getContainer().height()
    );
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.getContainer().x();
      const shapeInitialY = shape.getContainer().y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        const radius = Math.max(width / 2, height / 2);
        const cx = event.offsetX < shapeInitialX ? shapeInitialX - radius : shapeInitialX + radius;
        const cy = event.offsetY < shapeInitialY ? shapeInitialY - radius : shapeInitialY + radius;
        shape.getContainer().each(function () {
          this.radius(radius).center(cx, cy);
        });
      };
      const handleMouseUp = () => {
        _this.unselectAllShapes();
        _this.whiteboardDrawingService.select([shape]);
        svg.removeClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  protected createResizeGuideSW(shape: SvgCircle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(shape.getContainer().x(), shape.getContainer().y() + shape.getContainer().height());
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nesw-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.getContainer().x() + shape.getContainer().width();
      const shapeInitialY = shape.getContainer().y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        const radius = Math.max(width / 2, height / 2);
        const cx = event.offsetX < shapeInitialX ? shapeInitialX - radius : shapeInitialX + radius;
        const cy = event.offsetY < shapeInitialY ? shapeInitialY - radius : shapeInitialY + radius;
        shape.getContainer().each(function () {
          this.radius(radius).center(cx, cy);
        });
      };
      const handleMouseUp = () => {
        _this.unselectAllShapes();
        _this.whiteboardDrawingService.select([shape]);
        svg.removeClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  private createCircle(position: Position): Circle {
    return new Svg()
      .circle(0)
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(position.x, position.y)
      .fill('white')
      .stroke({ color: '#707070', width: this.getZoomedValue() });
  }
}
