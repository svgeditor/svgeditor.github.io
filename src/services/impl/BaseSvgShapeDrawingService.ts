import * as constants from '../../constants/constants';
import { ISvgShapeDrawingService } from '../api/ISvgShapeDrawingService';
import { IAppStateService } from '../api/IAppStateService';
import { SvgShape } from '../../models/SvgShape';
import { G, Shape } from '@svgdotjs/svg.js';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { IRandomIdService } from '../api/IRandomIdService';

export abstract class BaseSvgShapeDrawingService<T extends SvgShape<Shape>> implements ISvgShapeDrawingService<T> {
  abstract draw(event: MouseEvent): void;
  abstract resize(shape: T): void;

  constructor(
    protected appStateService: IAppStateService,
    protected whiteboardDrawingService: WhiteboardDrawingService,
    protected randomIdService: IRandomIdService
  ) {}

  unselectAllShapes(): void {
    this.whiteboardDrawingService.unselectAllShapes();
  }

  // prettier-ignore
  select(shape: T): void {
    shape.getContainer().addClass(constants.SELECTED_SHAPE_GROUP_CLASS_NAME);
    const group = this.whiteboardDrawingService.getSelectedShapesGroup();
    group.add(this.createBorder(shape));
    group.add(this.createResizeGuideNW(shape));
    group.add(this.createResizeGuideN(shape));
    group.add(this.createResizeGuideNE(shape));
    group.add(this.createResizeGuideE(shape));
    group.add(this.createResizeGuideSE(shape));
    group.add(this.createResizeGuideS(shape));
    group.add(this.createResizeGuideSW(shape));
    group.add(this.createResizeGuideW(shape));
    group.front();
  }

  getZoomedValue(initialValue = 1): number {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    return zoomLevel.getZoomedValueFromInitialValue(initialValue);
  }

  drawHoverGuide(shape: T): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    shape.getContainer().add(
      shape
        .getShape()
        .clone()
        .removeClass(constants.SHAPE_CLASS_NAME)
        .addClass(constants.HOVER_SHAPE_CLASS_NAME)
        .fill('transparent')
        .stroke({ color: constants.SELECTION_BORDER_COLOR, width: zoomLevel.getZoomedValueFromInitialValue(1) })
    );
  }

  redrawHoverGuide(shape: T): void {
    shape
      .getContainer()
      .find(`.${constants.HOVER_SHAPE_CLASS_NAME}`)
      .forEach((shape) => shape.remove());
    this.drawHoverGuide(shape);
  }

  // prettier-ignore
  protected createContainer(): G {
    return this.appStateService.getSvgRootElement()
      .group()
      .id(this.randomIdService.generate())
      .addClass(constants.SHAPE_GROUP_CLASS_NAME);
  }

  protected createBorder(shape: T): Shape {
    return this.appStateService
      .getSvgRootElement()
      .rect()
      .addClass(constants.SELECTED_SHAPE_BORDER_CLASS_NAME)
      .move(shape.getContainer().x(), shape.getContainer().y())
      .size(shape.getContainer().width(), shape.getContainer().height())
      .fill('transparent')
      .stroke({ color: constants.SELECTION_BORDER_COLOR, width: 1, dasharray: constants.STROKE_DASH_ARRAY });
  }

  protected createResizeGuideNW(shape: T): Shape {
    const svg = this.appStateService.getSvgRootElement();
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
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.getContainer().each(function () {
          this.move(x, y).size(width, height);
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

  protected createResizeGuideN(shape: T): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(shape.getContainer().x() + shape.getContainer().width() / 2, shape.getContainer().y());
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ns-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialY = shape.getContainer().y() + shape.getContainer().height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const y = Math.min(event.offsetY, shapeInitialY);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.getContainer().each(function () {
          this.y(y).height(height);
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

  protected createResizeGuideNE(shape: T): Shape {
    const svg = this.appStateService.getSvgRootElement();
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
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.getContainer().each(function () {
          this.move(x, y).size(width, height);
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

  protected createResizeGuideE(shape: T): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(
      shape.getContainer().x() + shape.getContainer().width(),
      shape.getContainer().y() + shape.getContainer().height() / 2
    );
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
        shape.getContainer().each(function () {
          this.x(x).width(width);
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

  protected createResizeGuideSE(shape: T): Shape {
    const svg = this.appStateService.getSvgRootElement();
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
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.getContainer().each(function () {
          this.move(x, y).size(width, height);
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

  protected createResizeGuideS(shape: T): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(
      shape.getContainer().x() + shape.getContainer().width() / 2,
      shape.getContainer().y() + shape.getContainer().height()
    );
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ns-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialY = shape.getContainer().y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const y = Math.min(event.offsetY, shapeInitialY);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.getContainer().each(function () {
          this.y(y).height(height);
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

  protected createResizeGuideSW(shape: T): Shape {
    const svg = this.appStateService.getSvgRootElement();
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
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.getContainer().each(function () {
          this.move(x, y).size(width, height);
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

  protected createResizeGuideW(shape: T): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(shape.getContainer().x(), shape.getContainer().y() + shape.getContainer().height() / 2);
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
        shape.getContainer().each(function () {
          this.x(x).width(width);
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

  // prettier-ignore
  protected createResizeGuide(x: number, y: number): Shape {
    return this.appStateService.getSvgRootElement()
      .circle(Math.min(this.getZoomedValue(8), 14))
      .cx(x).cy(y)
      .fill('white')
      .stroke({ color: constants.SELECTION_BORDER_COLOR, width: Math.min(this.getZoomedValue(), 3) });
  }
}
