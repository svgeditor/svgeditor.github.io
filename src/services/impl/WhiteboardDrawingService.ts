import * as constants from '../../constants/constants';
import { Circle, Ellipse, G, Line, Rect, Shape } from '@svgdotjs/svg.js';
import { IShapeDrawingService } from '../api/IShapeDrawingService';
import { IWhiteboardDrawingService } from '../api/IWhiteboardDrawingService';
import { RectangleDrawingService } from './RectangleDrawingService';
import { AppStateService } from './AppStateService';
import { UnselectAllShapes } from '../../models/user-actions/UnselectAllShapes';
import { UserActions } from '../../models/user-actions/UserActions';
import { SvgCircle, SvgEllipse, SvgLine, SvgRectangle, SvgElement } from '../../models/SvgElement';
import { CircleDrawingService } from './CircleDrawingService';
import { ESvgElement } from '../../models/SvgElement';
import { EllipseDrawingService } from './EllipseDrawingService';
import { LineDrawingService } from './LineDrawingService';

export class WhiteboardDrawingService implements IWhiteboardDrawingService {
  private static instance: IWhiteboardDrawingService = new WhiteboardDrawingService();
  private rectangleDrawingService: IShapeDrawingService<Rect>;
  private circleDrawingService: IShapeDrawingService<Circle>;
  private ellipseDrawingService: IShapeDrawingService<Ellipse>;
  private lineDrawingService: IShapeDrawingService<Line>;
  private selectedShapeGroup: G = null;

  private constructor(
    private appStateService = AppStateService.getInstance(),
    rectangleDrawingService?: IShapeDrawingService<Rect>,
    circleDrawingService?: IShapeDrawingService<Circle>,
    ellipseDrawingService?: IShapeDrawingService<Ellipse>,
    lineDrawingService?: IShapeDrawingService<Line>
  ) {
    this.rectangleDrawingService = rectangleDrawingService ? rectangleDrawingService : RectangleDrawingService.getInstance(this);
    this.circleDrawingService = circleDrawingService ? circleDrawingService : CircleDrawingService.getInstance(this);
    this.ellipseDrawingService = ellipseDrawingService ? ellipseDrawingService : EllipseDrawingService.getInstance(this);
    this.lineDrawingService = lineDrawingService ? lineDrawingService : LineDrawingService.getInstance(this);
  }

  static getInstance(): IWhiteboardDrawingService {
    return WhiteboardDrawingService.instance;
  }

  draw(shape: SvgElement<Shape>): void {
    this.appStateService.getSvgRootElement().add(shape.container);
  }

  drawOnMouseDown(event: MouseEvent): void {
    const shapeToDraw = this.appStateService.getShapeToDraw();
    switch (shapeToDraw) {
      case ESvgElement.RECTANGLE:
        return this.rectangleDrawingService.draw(event);
      case ESvgElement.CIRCLE:
        return this.circleDrawingService.draw(event);
      case ESvgElement.ELLIPSE:
        return this.ellipseDrawingService.draw(event);
      case ESvgElement.LINE:
        return this.lineDrawingService.draw(event);
      default:
      // no thing to do by default
    }
  }

  select(shape: SvgElement<Shape>): void {
    switch (true) {
      case shape.element instanceof Rect:
        return this.rectangleDrawingService.select(shape as SvgRectangle);
      case shape.element instanceof Circle:
        return this.circleDrawingService.select(shape as SvgCircle);
      case shape.element instanceof Ellipse:
        return this.ellipseDrawingService.select(shape as SvgEllipse);
      case shape.element instanceof Line:
        return this.lineDrawingService.select(shape as SvgLine);
      default:
      // nothing to do by default
    }
  }

  selectOnMouseDown(event: MouseEvent): void {
    const initialPosition = { x: event.offsetX, y: event.offsetY };
    const rectangle = this.appStateService.getSvgRootElement().rect();
    rectangle
      .addClass(constants.SHAPE_CLASS_NAME)
      .move(initialPosition.x, initialPosition.y)
      .size(0, 0)
      .fill(constants.SELECTION_COLOR)
      .stroke({ color: constants.SELECTION_BORDER_COLOR, width: 1 });
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      const x = Math.min(event.offsetX, initialPosition.x);
      const y = Math.min(event.offsetY, initialPosition.y);
      const width = Math.abs(event.offsetX - initialPosition.x);
      const height = Math.abs(event.offsetY - initialPosition.y);
      rectangle.move(x, y).size(width, height);
    };
    const onMouseUp = () => {
      rectangle.remove();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  move(event: MouseEvent, shape: SvgElement<Shape>): void {
    switch (true) {
      case shape.element instanceof Rect:
        return this.rectangleDrawingService.move(event, shape as SvgRectangle);
      case shape.element instanceof Circle:
        return this.circleDrawingService.move(event, shape as SvgCircle);
      case shape.element instanceof Ellipse:
        return this.ellipseDrawingService.move(event, shape as SvgEllipse);
      case shape.element instanceof Line:
        return this.lineDrawingService.move(event, shape as SvgLine);
      default:
      // nothing to do by default
    }
  }

  resizeAllShapes(): void {
    const svg = this.appStateService.getSvgRootElement();
    this.unselectAllShapes();
    svg.find('rect').forEach((shape) => {
      const container = shape.parent() as G;
      this.rectangleDrawingService.resize(new SvgRectangle(container, shape as Rect));
    });
    svg.find('circle').forEach((shape) => {
      const container = shape.parent() as G;
      this.circleDrawingService.resize(new SvgCircle(container, shape as Circle));
    });
    svg.find('ellipse').forEach((shape) => {
      const container = shape.parent() as G;
      this.ellipseDrawingService.resize(new SvgEllipse(container, shape as Ellipse));
    });
    svg.find('line').forEach((shape) => {
      const container = shape.parent() as G;
      this.lineDrawingService.resize(new SvgLine(container, shape as Line));
    });
  }

  unselectAllShapes(): void {
    this.appStateService
      .getSvgRootElement()
      .find(`.${constants.SELECTED_SHAPE_CLASS_NAME}`)
      .forEach((shape) => shape.removeClass(`${constants.SELECTED_SHAPE_CLASS_NAME}`));
    this.getSelectedShapesGroup().each(function () {
      this.remove();
    });
    document.dispatchEvent(UserActions.createCustomEvent(new UnselectAllShapes()));
  }

  bringToFront(shape: SvgElement<Shape>): void {
    shape.container.forward();
  }

  sendToBack(shape: SvgElement<Shape>): void {
    shape.container.backward();
  }

  delete(shape: SvgElement<Shape>): void {
    shape.container.remove();
    this.unselectAllShapes();
  }

  getSelectedShapesGroup(): G {
    let selectedShapeGroup = this.selectedShapeGroup;
    if (selectedShapeGroup) return selectedShapeGroup;
    const svg = this.appStateService.getSvgRootElement();
    selectedShapeGroup = svg.findOne(`g.${constants.SELECTED_SHAPE_GROUP_CLASS_NAME}`) as G;
    if (!selectedShapeGroup) selectedShapeGroup = svg.group().addClass(`${constants.SELECTED_SHAPE_GROUP_CLASS_NAME}`);
    this.selectedShapeGroup = selectedShapeGroup;
    return selectedShapeGroup;
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
          stroke-dasharray: ${constants.STROKE_DASH_ARRAY};
        }

        .${constants.RESIZE_SHAPE_GUIDE_CLASS_NAME} {
          transition: fill 0.15s ease-in-out;
        }

        .${constants.RESIZE_SHAPE_GUIDE_CLASS_NAME}:hover {
          fill: ${constants.SELECTION_BORDER_COLOR}
        }
      /* ]]> */
    `;
  }
}
