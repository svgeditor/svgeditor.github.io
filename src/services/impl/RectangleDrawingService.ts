import * as constants from '../../constants/constants';
import { ISvgShapeDrawingService } from '../ISvgShapeDrawingService';
import { BaseSvgShapeDrawingService } from './BaseSvgShapeDrawingService';
import { AddShape } from '../../models/user-actions/AddShape';
import { UserActions } from '../../models/user-actions/UserActions';
import { Position } from '../../models/Position';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { Rect, Shape, Svg } from '@svgdotjs/svg.js';
import { RandomIdGenerator } from './RandomIdGenerator';
import { SvgRectangle } from '../../models/svg-elements/SvgShape';
import { AppState } from '../../models/app-state/AppState';

export class RectangleDrawingService extends BaseSvgShapeDrawingService<SvgRectangle> implements ISvgShapeDrawingService<SvgRectangle> {
  private static instance: ISvgShapeDrawingService<SvgRectangle> = null;

  private constructor(whiteboardDrawingService: WhiteboardDrawingService) {
    super(AppState.getInstance(), whiteboardDrawingService, RandomIdGenerator.getInstance());
  }

  static getInstance(whiteboardDrawingService: WhiteboardDrawingService): ISvgShapeDrawingService<SvgRectangle> {
    if (RectangleDrawingService.instance == null) {
      RectangleDrawingService.instance = new RectangleDrawingService(whiteboardDrawingService);
    }
    return RectangleDrawingService.instance;
  }

  draw(event: MouseEvent): void {
    const _this = this;
    this.whiteboardDrawingService.unselectAllShapes();
    const initialPosition = new Position(event.offsetX, event.offsetY);
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

  select(shape: SvgRectangle): void {
    super.select(shape);
    const group = this.whiteboardDrawingService.getSelectedShapesGroup();
    group.add(this.createBorderRadiusGuide(shape));
  }

  resize(rectangle: SvgRectangle): void {
    const zoomLevel = this.appState.getZoomLevel();
    const newX = zoomLevel.getZoomedValueFromPreviousValue(rectangle.getShape().x());
    const newY = zoomLevel.getZoomedValueFromPreviousValue(rectangle.getShape().y());
    const newW = zoomLevel.getZoomedValueFromPreviousValue(rectangle.getShape().width());
    const newH = zoomLevel.getZoomedValueFromPreviousValue(rectangle.getShape().height());
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(rectangle.getShape().attr('stroke-width'));
    const rx = zoomLevel.getZoomedValueFromPreviousValue(rectangle.getShape().attr('rx'));
    const ry = zoomLevel.getZoomedValueFromPreviousValue(rectangle.getShape().attr('ry'));
    rectangle.getShape().move(newX, newY).size(newW, newH).attr('rx', rx).attr('ry', ry).attr('stroke-width', strokeWidth);
  }

  protected createResizeGuideNW(shape: SvgRectangle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(shape.getContainer().x(), shape.getContainer().y());
    const initialRadius = shape.getShape().attr('rx');
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.getContainer().x() + shape.getContainer().width();
      const shapeInitialY = shape.getContainer().y() + shape.getContainer().height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        const newRadius = Math.min(initialRadius, Math.min(width / 2, height / 2));
        shape.getContainer().each(function () {
          this.move(x, y).size(width, height).attr('rx', newRadius).attr('ry', newRadius);
        });
      };
      const handleMouseUp = () => {
        _this.whiteboardDrawingService.unselectAllShapesToSelectNewShape();
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

  protected createResizeGuideN(shape: SvgRectangle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(shape.getContainer().x() + shape.getContainer().width() / 2, shape.getContainer().y());
    const initialRadius = shape.getShape().attr('rx');
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ns-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialY = shape.getContainer().y() + shape.getContainer().height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = shape.getShape().width();
        const height = Math.abs(event.offsetY - shapeInitialY);
        const newRadius = Math.min(initialRadius, Math.min(width / 2, height / 2));
        shape.getContainer().each(function () {
          this.y(y).height(height).attr('rx', newRadius).attr('ry', newRadius);
        });
      };
      const handleMouseUp = () => {
        _this.whiteboardDrawingService.unselectAllShapesToSelectNewShape();
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

  protected createResizeGuideNE(shape: SvgRectangle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(shape.getContainer().x() + shape.getContainer().width(), shape.getContainer().y());
    const initialRadius = shape.getShape().attr('rx');
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nesw-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.getContainer().x();
      const shapeInitialY = shape.getContainer().y() + shape.getContainer().height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        const newRadius = Math.min(initialRadius, Math.min(width / 2, height / 2));
        shape.getContainer().each(function () {
          this.move(x, y).size(width, height).attr('rx', newRadius).attr('ry', newRadius);
        });
      };
      const handleMouseUp = () => {
        _this.whiteboardDrawingService.unselectAllShapesToSelectNewShape();
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

  protected createResizeGuideE(shape: SvgRectangle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(
      shape.getContainer().x() + shape.getContainer().width(),
      shape.getContainer().y() + shape.getContainer().height() / 2
    );
    const initialRadius = shape.getShape().attr('rx');
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ew-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.getContainer().x();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = shape.getShape().height();
        const newRadius = Math.min(initialRadius, Math.min(width / 2, height / 2));
        shape.getContainer().each(function () {
          this.x(x).width(width).attr('rx', newRadius).attr('ry', newRadius);
        });
      };
      const handleMouseUp = () => {
        _this.whiteboardDrawingService.unselectAllShapesToSelectNewShape();
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

  protected createResizeGuideSE(shape: SvgRectangle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(
      shape.getContainer().x() + shape.getContainer().width(),
      shape.getContainer().y() + shape.getContainer().height()
    );
    const initialRadius = shape.getShape().attr('rx');
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.getContainer().x();
      const shapeInitialY = shape.getContainer().y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        const newRadius = Math.min(initialRadius, Math.min(width / 2, height / 2));
        shape.getContainer().each(function () {
          this.move(x, y).size(width, height).attr('rx', newRadius).attr('ry', newRadius);
        });
      };
      const handleMouseUp = () => {
        _this.whiteboardDrawingService.unselectAllShapesToSelectNewShape();
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

  protected createResizeGuideS(shape: SvgRectangle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(
      shape.getContainer().x() + shape.getContainer().width() / 2,
      shape.getContainer().y() + shape.getContainer().height()
    );
    const initialRadius = shape.getShape().attr('rx');
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ns-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialY = shape.getContainer().y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = shape.getShape().width();
        const height = Math.abs(event.offsetY - shapeInitialY);
        const newRadius = Math.min(initialRadius, Math.min(width / 2, height / 2));
        shape.getContainer().each(function () {
          this.y(y).height(height).attr('rx', newRadius).attr('ry', newRadius);
        });
      };
      const handleMouseUp = () => {
        _this.whiteboardDrawingService.unselectAllShapesToSelectNewShape();
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

  protected createResizeGuideSW(shape: SvgRectangle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(shape.getContainer().x(), shape.getContainer().y() + shape.getContainer().height());
    const initialRadius = shape.getShape().attr('rx');
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nesw-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.getContainer().x() + shape.getContainer().width();
      const shapeInitialY = shape.getContainer().y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        const newRadius = Math.min(initialRadius, Math.min(width / 2, height / 2));
        shape.getContainer().each(function () {
          this.move(x, y).size(width, height).attr('rx', newRadius).attr('ry', newRadius);
        });
      };
      const handleMouseUp = () => {
        _this.whiteboardDrawingService.unselectAllShapesToSelectNewShape();
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

  protected createResizeGuideW(shape: SvgRectangle): Shape {
    const svg = new Svg();
    const circle = this.createResizeGuide(shape.getContainer().x(), shape.getContainer().y() + shape.getContainer().height() / 2);
    const initialRadius = shape.getShape().attr('rx');
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ew-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.getContainer().x() + shape.getContainer().width();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = shape.getShape().height();
        const newRadius = Math.min(initialRadius, Math.min(width / 2, height / 2));
        shape.getContainer().each(function () {
          this.x(x).width(width).attr('rx', newRadius).attr('ry', newRadius);
        });
      };
      const handleMouseUp = () => {
        _this.whiteboardDrawingService.unselectAllShapesToSelectNewShape();
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

  private createRectangle(position: Position): Rect {
    return new Svg()
      .rect(0)
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(position.x, position.y)
      .fill('white')
      .stroke({ color: '#707070', width: this.getZoomedValue() });
  }

  private createBorderRadiusGuide(shape: SvgRectangle): Shape {
    const svg = new Svg();
    const shapeRightBorder = shape.getContainer().x() + shape.getContainer().width();
    const shapeTopBorder = shape.getContainer().y();
    const borderRadiusGuideSize = 7;
    const margin = 15;
    const radius = shape.getShape().attr('rx');
    const borderRadiusGuideX = shapeRightBorder - Math.max(margin, radius) - borderRadiusGuideSize / 2;
    const borderRadiusGuideY = shapeTopBorder + Math.max(margin, radius) - borderRadiusGuideSize / 2;
    const borderRadiusGuide = new Svg()
      .rect()
      .move(borderRadiusGuideX, borderRadiusGuideY)
      .size(borderRadiusGuideSize, borderRadiusGuideSize)
      .fill('#F2931E')
      .radius(1)
      .addClass(constants.RESIZE_SHAPE_BORDER_RADIUS_GUIDE_CLASS_NAME)
      .on('mousedown', () => {
        const _this = this;
        svg.addClass(constants.RESIZE_SHAPE_BORDER_RADIUS_IN_PROGRESS_CLASS_NAME);
        const maxRadius = Math.min(shape.getContainer().width() / 2, shape.getContainer().height() / 2);
        const mousePositionXMax = shape.getContainer().x() + shape.getContainer().width();
        const mousePositionXMin = mousePositionXMax - maxRadius;
        const mousePositionYMin = shape.getContainer().y();
        const mousePositionYMax = mousePositionYMin + maxRadius;
        const handleMouseMove = (event) => {
          event.preventDefault();
          let radius = 0;
          if (
            event.offsetX >= mousePositionXMin &&
            event.offsetX <= mousePositionXMax &&
            event.offsetY >= mousePositionYMin &&
            event.offsetY <= mousePositionYMax
          ) {
            radius = Math.max(mousePositionXMax - event.offsetX, event.offsetY - mousePositionYMin);
          }
          if (event.offsetX < mousePositionXMin || event.offsetY > mousePositionYMax) {
            radius = maxRadius;
          }
          borderRadiusGuide.move(shapeRightBorder - borderRadiusGuideSize / 2 - radius, shapeTopBorder - borderRadiusGuideSize / 2 + radius);
          shape.getContainer().each(function () {
            this.attr('rx', radius).attr('ry', radius);
          });
        };
        const handleMouseUp = () => {
          _this.whiteboardDrawingService.unselectAllShapesToSelectNewShape();
          _this.whiteboardDrawingService.select([shape]);
          svg.removeClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      });
    return borderRadiusGuide;
  }
}
