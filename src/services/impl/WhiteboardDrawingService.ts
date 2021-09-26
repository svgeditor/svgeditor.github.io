import * as constants from '../../constants/constants';
import { Circle, Ellipse, G, Line, Rect, Shape, Svg } from '@svgdotjs/svg.js';
import { ISvgShapeDrawingService } from '../ISvgShapeDrawingService';
import { IWhiteboardDrawingService } from '../IWhiteboardDrawingService';
import { RectangleDrawingService } from './RectangleDrawingService';
import { UnselectAllShapes } from '../../models/user-actions/UnselectAllShapes';
import { UserActions } from '../../models/user-actions/UserActions';
import { CircleDrawingService } from './CircleDrawingService';
import { EllipseDrawingService } from './EllipseDrawingService';
import { LineDrawingService } from './LineDrawingService';
import { SelectShapes } from '../../models/user-actions/SelectShapes';
import { SvgCircle, SvgEllipse, SvgLine, SvgRectangle, SvgShape } from '../../models/svg-elements/SvgShape';
import { AppState } from '../../models/app-state/AppState';
import { ESvgElement } from '../../models/svg-elements/ESvgElement';

export class WhiteboardDrawingService implements IWhiteboardDrawingService {
  private static instance: IWhiteboardDrawingService = new WhiteboardDrawingService();
  private rectangleDrawingService: ISvgShapeDrawingService<SvgRectangle>;
  private circleDrawingService: ISvgShapeDrawingService<SvgCircle>;
  private ellipseDrawingService: ISvgShapeDrawingService<SvgEllipse>;
  private lineDrawingService: ISvgShapeDrawingService<SvgLine>;
  private selectedShapeGroup: G = null;

  private constructor(
    private appState = AppState.getInstance(),
    rectangleDrawingService?: ISvgShapeDrawingService<SvgRectangle>,
    circleDrawingService?: ISvgShapeDrawingService<SvgCircle>,
    ellipseDrawingService?: ISvgShapeDrawingService<SvgEllipse>,
    lineDrawingService?: ISvgShapeDrawingService<SvgLine>
  ) {
    this.rectangleDrawingService = rectangleDrawingService ? rectangleDrawingService : RectangleDrawingService.getInstance(this);
    this.circleDrawingService = circleDrawingService ? circleDrawingService : CircleDrawingService.getInstance(this);
    this.ellipseDrawingService = ellipseDrawingService ? ellipseDrawingService : EllipseDrawingService.getInstance(this);
    this.lineDrawingService = lineDrawingService ? lineDrawingService : LineDrawingService.getInstance(this);
  }

  static getInstance(): IWhiteboardDrawingService {
    return WhiteboardDrawingService.instance;
  }

  draw(shape: SvgShape<Shape>): void {
    new Svg().add(shape.getContainer());
  }

  drawOnMouseDown(event: MouseEvent): void {
    const shapeToDraw = this.appState.getSelectedSvgElement();
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

  select(shapes: SvgShape<Shape>[]): void {
    shapes.forEach((shape) => {
      switch (true) {
        case shape.getShape() instanceof Rect:
          this.rectangleDrawingService.select(shape as SvgRectangle);
          break;
        case shape.getShape() instanceof Circle:
          this.circleDrawingService.select(shape as SvgCircle);
          break;
        case shape.getShape() instanceof Ellipse:
          this.ellipseDrawingService.select(shape as SvgEllipse);
          break;
        case shape.getShape() instanceof Line:
          this.lineDrawingService.select(shape as SvgLine);
          break;
        default:
        // nothing to do by default
      }
    });
    document.dispatchEvent(UserActions.createCustomEvent(new SelectShapes(shapes)));
  }

  selectOnMouseDown(event: MouseEvent): void {
    const _this = this;
    const initialPosition = { x: event.offsetX, y: event.offsetY };
    const rectangle = new Svg().rect();
    const allShapes = this.getAllShapes();
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
      _this.unselectAllShapesToSelectNewShape();
      _this.select(allShapes.filter((shape) => shape.inside(rectangle)));
      rectangle.remove();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  move(event: MouseEvent, shapes: SvgShape<Shape>[]): void {
    const _this = this;
    let moveInProgressFlag = false;
    let mousePosition = { x: event.clientX, y: event.clientY };

    const onMouseMove = (event: MouseEvent) => {
      if (!moveInProgressFlag) new Svg().addClass(constants.MOVE_SHAPE_IN_PROGRESS_CLASS_NAME);
      moveInProgressFlag = true;
      event.preventDefault();
      let previousMousePosition = { ...mousePosition };
      mousePosition = { x: event.clientX, y: event.clientY };
      shapes.forEach((shape) => {
        const x = shape.getContainer().x() + (mousePosition.x - previousMousePosition.x);
        const y = shape.getContainer().y() + (mousePosition.y - previousMousePosition.y);
        shape.getContainer().move(x, y);
      });
    };

    const onMouseUp = () => {
      new Svg().removeClass(constants.MOVE_SHAPE_IN_PROGRESS_CLASS_NAME);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setTimeout(() => _this.select(shapes), 0);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  resizeAllShapes(): void {
    const svg = new Svg();
    this.unselectAllShapes();
    svg.find('rect').forEach((shape) => {
      this.rectangleDrawingService.resize(new SvgRectangle(shape.parent() as G, shape as Rect));
    });
    svg.find('circle').forEach((shape) => {
      this.circleDrawingService.resize(new SvgCircle(shape.parent() as G, shape as Circle));
    });
    svg.find('ellipse').forEach((shape) => {
      this.ellipseDrawingService.resize(new SvgEllipse(shape.parent() as G, shape as Ellipse));
    });
    svg.find('line').forEach((shape) => {
      this.lineDrawingService.resize(new SvgLine(shape.parent() as G, shape as Line));
    });
  }

  unselectAllShapes(): void {
    this.unselectAllShapesToSelectNewShape();
    document.dispatchEvent(UserActions.createCustomEvent(new UnselectAllShapes()));
  }

  unselectAllShapesToSelectNewShape(): void {
    new Svg()
      .find(`.${constants.SELECTED_SHAPE_GROUP_CLASS_NAME}`)
      .forEach((shape) => shape.removeClass(`${constants.SELECTED_SHAPE_GROUP_CLASS_NAME}`));
    this.getSelectedShapesGroup().each(function () {
      this.remove();
    });
  }

  selectAllShapes(): void {
    const shapes = this.getAllShapes();
    shapes.forEach((shape) => this.select([shape]));
    document.dispatchEvent(UserActions.createCustomEvent(new SelectShapes(shapes)));
  }

  getAllShapes(): SvgShape<Shape>[] {
    return new Svg().find(`.${constants.SHAPE_CLASS_NAME}`).map((shape) => new SvgShape(shape.parent() as G, shape));
  }

  getAllSelectedShapes(): SvgShape<Shape>[] {
    return new Svg()
      .find(`.${constants.SELECTED_SHAPE_GROUP_CLASS_NAME}`)
      .map((group) => new SvgShape(group as G, group.findOne(`.${constants.SHAPE_CLASS_NAME}`) as Shape));
  }

  bringToFront(shapes: SvgShape<Shape>[]): void {
    shapes.forEach((shape) => shape.getContainer().forward());
  }

  sendToBack(shapes: SvgShape<Shape>[]): void {
    shapes.forEach((shape) => shape.getContainer().backward());
  }

  delete(shapes: SvgShape<Shape>[]): void {
    shapes.forEach((shape) => shape.getContainer().remove());
    this.unselectAllShapes();
  }

  getSelectedShapesGroup(): G {
    let selectedShapeGroup = this.selectedShapeGroup;
    if (selectedShapeGroup) return selectedShapeGroup;
    const svg = new Svg();
    selectedShapeGroup = svg.findOne(`g.${constants.SELECTED_SHAPES_GROUP_CLASS_NAME}`) as G;
    if (!selectedShapeGroup) selectedShapeGroup = svg.group().addClass(`${constants.SELECTED_SHAPES_GROUP_CLASS_NAME}`);
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

        .${constants.SELECTED_SHAPES_GROUP_CLASS_NAME} .${constants.SELECTED_SHAPE_BORDER_CLASS_NAME} {
          pointer-events: none;
        }

        .${constants.MOVE_SHAPE_IN_PROGRESS_CLASS_NAME} .${constants.RESIZE_SHAPE_BORDER_RADIUS_GUIDE_CLASS_NAME},
        .${constants.MOVE_SHAPE_IN_PROGRESS_CLASS_NAME} .${constants.RESIZE_SHAPE_GUIDE_CLASS_NAME},
        .${constants.RESIZE_SHAPE_IN_PROGRESS_CLASS_NAME} .${constants.RESIZE_SHAPE_BORDER_RADIUS_GUIDE_CLASS_NAME},
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
