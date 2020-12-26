import { G, Rect, Shape, Svg } from '@svgdotjs/svg.js';
import * as constants from './_constants';
import { IShapeService } from '../api/IShapeService';
import { AppStateService } from './AppStateService';
import { BaseShapeService } from './BaseShapeService';
import { IWhiteboardDrawingService } from '../api/IWhiteboardDrawingService';
import { AddShapeAction } from '../../models/UndoableAction';
import { SELECT_SHAPE_EVENT } from '../../models/CustomEvents';

interface Position {
  x: number;
  y: number;
}

export class RectShapeService extends BaseShapeService implements IShapeService {
  private container: G;
  private element: Rect;
  private initialPosition: Position;

  constructor(private whiteboardDrawingService: IWhiteboardDrawingService, appStateService = AppStateService.getInstance()) {
    super(appStateService);
    this.createOnMouseDownInProgress = this.createOnMouseDownInProgress.bind(this);
    this.endCreateOnMouseDown = this.endCreateOnMouseDown.bind(this);
  }

  resize(shape: Shape): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const newX = zoomLevel.getZoomedValueFromPreviousValue(shape.x());
    const newY = zoomLevel.getZoomedValueFromPreviousValue(shape.y());
    const newW = zoomLevel.getZoomedValueFromPreviousValue(shape.width());
    const newH = zoomLevel.getZoomedValueFromPreviousValue(shape.height());
    const strokeWidth = zoomLevel.getZoomedValueFromPreviousValue(shape.attr('stroke-width'));
    shape.move(newX, newY).size(newW, newH).attr('stroke-width', strokeWidth);
  }

  // prettier-ignore
  createOnMouseDown(event: MouseEvent): void {
    const svg = this.appStateService.getSvgRootElement();
    this.container = svg.group().addClass(constants.SHAPE_GROUP_CLASS_NAME);
    this.element = svg.rect();
    this.initialPosition = { x: event.offsetX, y: event.offsetY };
    this.container.add(this.element);
    this.element
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(event.offsetX, event.offsetY)
      .size(0, 0)
      .fill('white')
      .stroke({color: '#707070', width: this.getZoomedValue()});
    document.addEventListener('mousemove', this.createOnMouseDownInProgress);
    document.addEventListener('mouseup', this.endCreateOnMouseDown);
  }

  // prettier-ignore
  select(shape: Shape): void {
    this.whiteboardDrawingService.unselectAll();
    shape.addClass(constants.SELECTED_SHAPE_CLASS_NAME);
    const svg = this.appStateService.getSvgRootElement();
    const group = this.appStateService.getSelectedShapesGroup();
    group.add(this.createBorder(svg, shape));
    group.add(this.createResizeGuideNW(svg, shape));
    group.add(this.createResizeGuideN(svg, shape));
    group.add(this.createResizeGuideNE(svg, shape));
    group.add(this.createResizeGuideE(svg, shape));
    group.add(this.createResizeGuideSE(svg, shape));
    group.add(this.createResizeGuideS(svg, shape));
    group.add(this.createResizeGuideSW(svg, shape));
    group.add(this.createResizeGuideW(svg, shape));
    group.front();
    document.dispatchEvent(SELECT_SHAPE_EVENT);
  }

  getStyles(): string {
    return `
      /* <![CDATA[ */
        .${constants.ON_HOVER_CLASS_NAME} {
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease-in-out;
        }
        .${constants.SHAPE_GROUP_CLASS_NAME}:hover .${constants.ON_HOVER_CLASS_NAME} {
          opacity: 1;
        }

        .${constants.SELECTION_GROUP_CLASS_NAME} .${constants.SELECTED_SHAPE_BORDER_CLASS_NAME} {
          pointer-events: none;
        }

        .${constants.MOVE_IN_PROGRESS_CLASS_NAME} .${constants.RESIZE_GUIDE_CLASS_NAME},
        .${constants.RESIZE_IN_PROGRESS_CLASS_NAME} .${constants.RESIZE_GUIDE_CLASS_NAME} {
          opacity: 0;
        }

        .${constants.MOVE_IN_PROGRESS_CLASS_NAME} .${constants.SELECTED_SHAPE_BORDER_CLASS_NAME},
        .${constants.RESIZE_IN_PROGRESS_CLASS_NAME} .${constants.SELECTED_SHAPE_BORDER_CLASS_NAME} {
          opacity: 0.8;
          stroke-dasharray: 5,5;
        }

        .${constants.RESIZE_GUIDE_CLASS_NAME} {
          transition: fill 0.15s ease-in-out;
        }

        .${constants.RESIZE_GUIDE_CLASS_NAME}:hover {
          fill: ${constants.SELECTION_COLOR}
        }
      /* ]]> */
    `;
  }

  private createOnMouseDownInProgress(event: MouseEvent): void {
    event.preventDefault();
    const x = Math.min(event.offsetX, this.initialPosition.x);
    const y = Math.min(event.offsetY, this.initialPosition.y);
    const width = Math.abs(event.offsetX - this.initialPosition.x);
    const height = Math.abs(event.offsetY - this.initialPosition.y);
    this.element.move(x, y).size(width, height);
  }

  // prettier-ignore
  private endCreateOnMouseDown(event: MouseEvent) {
    if (this.element.width() == 0 || this.element.height() == 0) {
      this.container.remove();
    } else {
      this.appStateService.pushUndoableUserAction(new AddShapeAction(this.container, this.whiteboardDrawingService));
      this.container.add(this.element.clone()
        .addClass(constants.ON_HOVER_CLASS_NAME)
        .fill('transparent')
        .stroke({ color: constants.SELECTION_COLOR, width: 1 }));
      setTimeout(() => this.select(this.container), 0);
    }
    document.removeEventListener('mousemove', this.createOnMouseDownInProgress);
    document.removeEventListener('mouseup', this.endCreateOnMouseDown);
  }

  private createBorder(svg: Svg, shape: Shape): Shape {
    return svg
      .rect()
      .addClass(constants.SELECTED_SHAPE_BORDER_CLASS_NAME)
      .move(shape.x(), shape.y())
      .size(shape.width(), shape.height())
      .fill('transparent')
      .stroke({ color: constants.SELECTION_COLOR, width: 1 });
  }

  private createResizeGuideNW(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x(), shape.y());
    circle.addClass(constants.RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.x() + shape.width();
      const shapeInitialY = shape.y() + shape.height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.each(function () {
          this.move(x, y).size(width, height);
        });
      };
      const handleMouseUp = () => {
        _this.select(shape);
        svg.removeClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  private createResizeGuideN(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x() + shape.width() / 2, shape.y());
    circle.addClass(constants.RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ns-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialY = shape.y() + shape.height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const y = Math.min(event.offsetY, shapeInitialY);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.each(function () {
          this.y(y).height(height);
        });
      };
      const handleMouseUp = () => {
        _this.select(shape);
        svg.removeClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  private createResizeGuideNE(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x() + shape.width(), shape.y());
    circle.addClass(constants.RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nesw-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.x();
      const shapeInitialY = shape.y() + shape.height();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.each(function () {
          this.move(x, y).size(width, height);
        });
      };
      const handleMouseUp = () => {
        _this.select(shape);
        svg.removeClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  private createResizeGuideE(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x() + shape.width(), shape.y() + shape.height() / 2);
    circle.addClass(constants.RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ew-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.x();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const width = Math.abs(event.offsetX - shapeInitialX);
        shape.each(function () {
          this.x(x).width(width);
        });
      };
      const handleMouseUp = () => {
        _this.select(shape);
        svg.removeClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  private createResizeGuideSE(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x() + shape.width(), shape.y() + shape.height());
    circle.addClass(constants.RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.x();
      const shapeInitialY = shape.y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.each(function () {
          this.move(x, y).size(width, height);
        });
      };
      const handleMouseUp = () => {
        _this.select(shape);
        svg.removeClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  private createResizeGuideS(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x() + shape.width() / 2, shape.y() + shape.height());
    circle.addClass(constants.RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ns-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialY = shape.y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const y = Math.min(event.offsetY, shapeInitialY);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.each(function () {
          this.y(y).height(height);
        });
      };
      const handleMouseUp = () => {
        _this.select(shape);
        svg.removeClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  private createResizeGuideSW(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x(), shape.y() + shape.height());
    circle.addClass(constants.RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nesw-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.x() + shape.width();
      const shapeInitialY = shape.y();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const y = Math.min(event.offsetY, shapeInitialY);
        const width = Math.abs(event.offsetX - shapeInitialX);
        const height = Math.abs(event.offsetY - shapeInitialY);
        shape.each(function () {
          this.move(x, y).size(width, height);
        });
      };
      const handleMouseUp = () => {
        _this.select(shape);
        svg.removeClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  private createResizeGuideW(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x(), shape.y() + shape.height() / 2);
    circle.addClass(constants.RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ew-resize');
    circle.on('mousedown', () => {
      const _this = this;
      svg.addClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
      const shapeInitialX = shape.x() + shape.width();
      const handleMouseMove = (event) => {
        event.preventDefault();
        const x = Math.min(event.offsetX, shapeInitialX);
        const width = Math.abs(event.offsetX - shapeInitialX);
        shape.each(function () {
          this.x(x).width(width);
        });
      };
      const handleMouseUp = () => {
        _this.select(shape);
        svg.removeClass(constants.RESIZE_IN_PROGRESS_CLASS_NAME);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    });
    return circle;
  }

  // prettier-ignore
  private createResizeGuide(svg: Svg, x: number, y: number): Shape {
    return svg
      .circle(Math.min(this.getZoomedValue(8), 14))
      .cx(x).cy(y)
      .fill('white')
      .stroke({ color: constants.SELECTION_COLOR, width: Math.min(this.getZoomedValue(), 3) });
  }

  private getZoomedValue(initialValue = 1): number {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    return zoomLevel.getZoomedValueFromInitialValue(initialValue);
  }
}
