import * as constants from '../../constants/constants';
import { IShapeDrawingService } from '../api/IShapeDrawingService';
import { IAppStateService } from '../api/IAppStateService';
import { Position } from '../../models/Position';
import { ShapeInfo } from '../../models/ShapeInfo';
import { G, Shape, Svg } from '@svgdotjs/svg.js';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { SelectShape } from '../../models/user-actions/SelectShape';
import { UserActions } from '../../models/user-actions/UserActions';

export abstract class BaseShapeDrawingService implements IShapeDrawingService {
  abstract createOnMouseDown(event: MouseEvent): void;
  abstract resize(shape: ShapeInfo): void;

  private mousePosition: Position;
  private shapeToMoveContainer: G;
  private moveInProgressFlag: boolean;

  constructor(protected appStateService: IAppStateService, protected whiteboardDrawingService: WhiteboardDrawingService) {
    this.moveInProgress = this.moveInProgress.bind(this);
    this.endMove = this.endMove.bind(this);
  }

  move(event: MouseEvent, shapeToMove: ShapeInfo): void {
    this.select(shapeToMove);
    this.moveInProgressFlag = false;
    this.mousePosition = { x: event.clientX, y: event.clientY };
    this.shapeToMoveContainer = shapeToMove.container;
    document.addEventListener('mousemove', this.moveInProgress);
    document.addEventListener('mouseup', this.endMove);
  }

  getStyles(): string {
    return `
      /* <![CDATA[ */
        .${constants.SHAPE_CLASS_NAME} {
          cursor: move;
        }
        .${constants.HOVER_SHAPE_CLASS_NAME} {
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease-in-out;
        }
        .${constants.SHAPE_GROUP_CLASS_NAME}:hover .${constants.HOVER_SHAPE_CLASS_NAME} {
          opacity: 1;
        }

        .${constants.SELECTED_SHAPE_GROUP_CLASS_NAME} .${constants.SELECTED_SHAPE_BORDER_CLASS_NAME} {
          pointer-events: none;
        }

        .${constants.MOVE_SHAPE_IN_PROGRESS_CLASS_NAME} .${constants.RESIZE_SHAPE_GUIDE_CLASS_NAME},
        .${constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME} .${constants.RESIZE_SHAPE_GUIDE_CLASS_NAME} {
          opacity: 0;
        }

        .${constants.MOVE_SHAPE_IN_PROGRESS_CLASS_NAME} .${constants.SELECTED_SHAPE_BORDER_CLASS_NAME},
        .${constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME} .${constants.SELECTED_SHAPE_BORDER_CLASS_NAME} {
          opacity: 0.8;
          stroke-dasharray: 5,5;
        }

        .${constants.RESIZE_SHAPE_GUIDE_CLASS_NAME} {
          transition: fill 0.15s ease-in-out;
        }

        .${constants.RESIZE_SHAPE_GUIDE_CLASS_NAME}:hover {
          fill: ${constants.SELECTION_COLOR}
        }
      /* ]]> */
    `;
  }

  // prettier-ignore
  select(shape: ShapeInfo): void {
    this.whiteboardDrawingService.unselectAll();
    shape.container.addClass(constants.SELECTED_SHAPE_CLASS_NAME);
    const svg = this.appStateService.getSvgRootElement();
    const group = this.whiteboardDrawingService.getSelectedShapesGroup();
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
    document.dispatchEvent(UserActions.createCustomEvent(new SelectShape(shape)));
  }

  getZoomedValue(initialValue = 1): number {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    return zoomLevel.getZoomedValueFromInitialValue(initialValue);
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

  private createBorder(svg: Svg, shape: ShapeInfo): Shape {
    return svg
      .rect()
      .addClass(constants.SELECTED_SHAPE_BORDER_CLASS_NAME)
      .move(shape.container.x(), shape.container.y())
      .size(shape.container.width(), shape.container.height())
      .fill('transparent')
      .stroke({ color: constants.SELECTION_COLOR, width: 1 });
  }

  private createResizeGuideNW(svg: Svg, shape: ShapeInfo): Shape {
    const circle = this.createResizeGuide(svg, shape.container.x(), shape.container.y());
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

  private createResizeGuideN(svg: Svg, shape: ShapeInfo): Shape {
    const circle = this.createResizeGuide(svg, shape.container.x() + shape.container.width() / 2, shape.container.y());
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

  private createResizeGuideNE(svg: Svg, shape: ShapeInfo): Shape {
    const circle = this.createResizeGuide(svg, shape.container.x() + shape.container.width(), shape.container.y());
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

  private createResizeGuideE(svg: Svg, shape: ShapeInfo): Shape {
    const circle = this.createResizeGuide(svg, shape.container.x() + shape.container.width(), shape.container.y() + shape.container.height() / 2);
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

  private createResizeGuideSE(svg: Svg, shape: ShapeInfo): Shape {
    const circle = this.createResizeGuide(svg, shape.container.x() + shape.container.width(), shape.container.y() + shape.container.height());
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

  private createResizeGuideS(svg: Svg, shape: ShapeInfo): Shape {
    const circle = this.createResizeGuide(svg, shape.container.x() + shape.container.width() / 2, shape.container.y() + shape.container.height());
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

  private createResizeGuideSW(svg: Svg, shape: ShapeInfo): Shape {
    const circle = this.createResizeGuide(svg, shape.container.x(), shape.container.y() + shape.container.height());
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

  private createResizeGuideW(svg: Svg, shape: ShapeInfo): Shape {
    const circle = this.createResizeGuide(svg, shape.container.x(), shape.container.y() + shape.container.height() / 2);
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
  private createResizeGuide(svg: Svg, x: number, y: number): Shape {
    return svg
      .circle(Math.min(this.getZoomedValue(8), 14))
      .cx(x).cy(y)
      .fill('white')
      .stroke({ color: constants.SELECTION_COLOR, width: Math.min(this.getZoomedValue(), 3) });
  }
}
