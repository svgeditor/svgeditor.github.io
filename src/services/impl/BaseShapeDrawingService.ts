import * as constants from '../../constants/constants';
import { IShapeDrawingService } from '../api/IShapeDrawingService';
import { IAppStateService } from '../api/IAppStateService';
import { Position } from '../../models/Position';
import { SvgElement } from '../../models/SvgElement';
import { G, Shape } from '@svgdotjs/svg.js';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { SelectShape } from '../../models/user-actions/SelectShape';
import { UserActions } from '../../models/user-actions/UserActions';

export abstract class BaseShapeDrawingService<T extends Shape> implements IShapeDrawingService<T> {
  abstract draw(event: MouseEvent): void;
  abstract resize(shape: SvgElement<T>): void;

  private mousePosition: Position;
  private shapeToMoveContainer: G;
  private moveInProgressFlag: boolean;

  constructor(protected appStateService: IAppStateService, protected whiteboardDrawingService: WhiteboardDrawingService) {
    this.moveInProgress = this.moveInProgress.bind(this);
    this.endMove = this.endMove.bind(this);
  }

  move(event: MouseEvent, shapeToMove: SvgElement<T>): void {
    this.select(shapeToMove);
    this.moveInProgressFlag = false;
    this.mousePosition = { x: event.clientX, y: event.clientY };
    this.shapeToMoveContainer = shapeToMove.container;
    document.addEventListener('mousemove', this.moveInProgress);
    document.addEventListener('mouseup', this.endMove);
  }

  // prettier-ignore
  select(shape: SvgElement<T>): void {
    shape.container.addClass(constants.SELECTED_SHAPE_CLASS_NAME);
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
    document.dispatchEvent(UserActions.createCustomEvent(new SelectShape(shape)));
  }

  getZoomedValue(initialValue = 1): number {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    return zoomLevel.getZoomedValueFromInitialValue(initialValue);
  }

  drawHoverGuide(shape: SvgElement<T>): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    shape.container.add(
      shape.element
        .clone()
        .removeClass(constants.SHAPE_CLASS_NAME)
        .addClass(constants.HOVER_SHAPE_CLASS_NAME)
        .fill('transparent')
        .stroke({ color: constants.SELECTION_COLOR, width: zoomLevel.getZoomedValueFromInitialValue(1) })
    );
  }

  redrawHoverGuide(shape: SvgElement<T>): void {
    shape.container.find(`.${constants.HOVER_SHAPE_CLASS_NAME}`).forEach((shape) => shape.remove());
    this.drawHoverGuide(shape);
  }

  private moveInProgress(event: MouseEvent): void {
    if (!this.moveInProgressFlag) this.appStateService.getSvgRootElement().addClass(constants.MOVE_SHAPE_IN_PROGRESS_CLASS_NAME);
    this.moveInProgressFlag = true;
    event.preventDefault();
    let previousMousePosition = { ...this.mousePosition };
    this.mousePosition = { x: event.clientX, y: event.clientY };
    const x = this.shapeToMoveContainer.x() + (this.mousePosition.x - previousMousePosition.x);
    const y = this.shapeToMoveContainer.y() + (this.mousePosition.y - previousMousePosition.y);
    this.shapeToMoveContainer.move(x, y);
  }

  private endMove(): void {
    this.appStateService.getSvgRootElement().removeClass(constants.MOVE_SHAPE_IN_PROGRESS_CLASS_NAME);
    document.removeEventListener('mousemove', this.moveInProgress);
    document.removeEventListener('mouseup', this.endMove);
  }

  private createBorder(shape: SvgElement<T>): Shape {
    return this.appStateService
      .getSvgRootElement()
      .rect()
      .addClass(constants.SELECTED_SHAPE_BORDER_CLASS_NAME)
      .move(shape.container.x(), shape.container.y())
      .size(shape.container.width(), shape.container.height())
      .fill('transparent')
      .stroke({ color: constants.SELECTION_COLOR, width: 1, dasharray: constants.STROKE_DASH_ARRAY });
  }

  private createResizeGuideNW(shape: SvgElement<T>): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(shape.container.x(), shape.container.y());
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.container.x() + shape.container.width();
      const shapeInitialY = shape.container.y() + shape.container.height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.container.each(function () {
          this.move(x, y).size(width, height);
        });
      };
      const handleMouseUp = () => {
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

  private createResizeGuideN(shape: SvgElement<T>): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(shape.container.x() + shape.container.width() / 2, shape.container.y());
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ns-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialY = shape.container.y() + shape.container.height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const y = Math.min(event.offsetY, shapeInitialY);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.container.each(function () {
          this.y(y).height(height);
        });
      };
      const handleMouseUp = () => {
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

  private createResizeGuideNE(shape: SvgElement<T>): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(shape.container.x() + shape.container.width(), shape.container.y());
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nesw-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.container.x();
      const shapeInitialY = shape.container.y() + shape.container.height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.container.each(function () {
          this.move(x, y).size(width, height);
        });
      };
      const handleMouseUp = () => {
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

  private createResizeGuideE(shape: SvgElement<T>): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(shape.container.x() + shape.container.width(), shape.container.y() + shape.container.height() / 2);
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ew-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.container.x();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const width = Math.abs(event.offsetX - shapeInitialX);
        shape.container.each(function () {
          this.x(x).width(width);
        });
      };
      const handleMouseUp = () => {
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

  private createResizeGuideSE(shape: SvgElement<T>): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(shape.container.x() + shape.container.width(), shape.container.y() + shape.container.height());
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.container.x();
      const shapeInitialY = shape.container.y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.container.each(function () {
          this.move(x, y).size(width, height);
        });
      };
      const handleMouseUp = () => {
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

  private createResizeGuideS(shape: SvgElement<T>): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(shape.container.x() + shape.container.width() / 2, shape.container.y() + shape.container.height());
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ns-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialY = shape.container.y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const y = Math.min(event.offsetY, shapeInitialY);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.container.each(function () {
          this.y(y).height(height);
        });
      };
      const handleMouseUp = () => {
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

  private createResizeGuideSW(shape: SvgElement<T>): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(shape.container.x(), shape.container.y() + shape.container.height());
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nesw-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.container.x() + shape.container.width();
      const shapeInitialY = shape.container.y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.container.each(function () {
          this.move(x, y).size(width, height);
        });
      };
      const handleMouseUp = () => {
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

  private createResizeGuideW(shape: SvgElement<T>): Shape {
    const svg = this.appStateService.getSvgRootElement();
    const circle = this.createResizeGuide(shape.container.x(), shape.container.y() + shape.container.height() / 2);
    circle.addClass(constants.RESIZE_SHAPE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ew-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.container.x() + shape.container.width();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const width = Math.abs(event.offsetX - shapeInitialX);
        shape.container.each(function () {
          this.x(x).width(width);
        });
      };
      const handleMouseUp = () => {
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

  // prettier-ignore
  protected createResizeGuide(x: number, y: number): Shape {
    return this.appStateService.getSvgRootElement()
      .circle(Math.min(this.getZoomedValue(8), 14))
      .cx(x).cy(y)
      .fill('white')
      .stroke({ color: constants.SELECTION_COLOR, width: Math.min(this.getZoomedValue(), 3) });
  }
}
