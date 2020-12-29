import { Circle, Ellipse, G, Line, Rect, Shape } from '@svgdotjs/svg.js';
import { SELECTED_SHAPE_CLASS_NAME, SELECTED_SHAPE_GROUP_CLASS_NAME } from '../../constants/constants';
import { IShapeDrawingService } from '../api/IShapeDrawingService';
import { IWhiteboardDrawingService } from '../api/IWhiteboardDrawingService';
import { RectangleDrawingService } from './RectangleDrawingService';
import { AppStateService } from './AppStateService';
import { UnselectAllShapes } from '../../models/user-actions/UnselectAllShapes';
import { UserActions } from '../../models/user-actions/UserActions';
import { CircleInfo, EllipseInfo, LineInfo, RectangleInfo, ShapeInfo } from '../../models/ShapeInfo';
import { CircleDrawingService } from './CircleDrawingService';
import { ECursorFunction } from '../../models/ECursorFunction';
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

  createShapeOnMouseDown(event: MouseEvent): void {
    const cursorFunction = this.appStateService.getCursorFunction();
    switch (cursorFunction) {
      case ECursorFunction.DRAW_RECTANGLES:
        return this.rectangleDrawingService.createOnMouseDown(event);
      case ECursorFunction.DRAW_CIRCLES:
        return this.circleDrawingService.createOnMouseDown(event);
      case ECursorFunction.DRAW_ELLIPSES:
        return this.ellipseDrawingService.createOnMouseDown(event);
      case ECursorFunction.DRAW_LINES:
        return this.lineDrawingService.createOnMouseDown(event);
      default:
        return this.rectangleDrawingService.createOnMouseDown(event);
    }
  }

  select(shape: ShapeInfo<Shape>): void {
    switch (true) {
      case shape.shape instanceof Rect:
        return this.rectangleDrawingService.select(shape as RectangleInfo);
      case shape.shape instanceof Circle:
        return this.circleDrawingService.select(shape as CircleInfo);
      case shape.shape instanceof Ellipse:
        return this.ellipseDrawingService.select(shape as EllipseInfo);
      case shape.shape instanceof Line:
        return this.lineDrawingService.select(shape as LineInfo);
      default:
      // nothing to do by default
    }
  }

  move(event: MouseEvent, shape: ShapeInfo<Shape>): void {
    switch (true) {
      case shape.shape instanceof Rect:
        return this.rectangleDrawingService.move(event, shape as RectangleInfo);
      case shape.shape instanceof Circle:
        return this.circleDrawingService.move(event, shape as CircleInfo);
      case shape.shape instanceof Ellipse:
        return this.ellipseDrawingService.move(event, shape as EllipseInfo);
      case shape.shape instanceof Line:
        return this.lineDrawingService.move(event, shape as LineInfo);
      default:
      // nothing to do by default
    }
  }

  getStyles(): string {
    return this.rectangleDrawingService.getStyles();
  }

  resize(): void {
    const svg = this.appStateService.getSvgRootElement();
    this.unselectAll();
    svg.find('rect').forEach((shape) => {
      const container = shape.parent() as G;
      this.rectangleDrawingService.resize(new RectangleInfo(container, shape as Rect));
    });
    svg.find('circle').forEach((shape) => {
      const container = shape.parent() as G;
      this.circleDrawingService.resize(new CircleInfo(container, shape as Circle));
    });
    svg.find('ellipse').forEach((shape) => {
      const container = shape.parent() as G;
      this.ellipseDrawingService.resize(new EllipseInfo(container, shape as Ellipse));
    });
    svg.find('line').forEach((shape) => {
      const container = shape.parent() as G;
      this.lineDrawingService.resize(new LineInfo(container, shape as Line));
    });
  }

  unselectAll(): void {
    this.appStateService
      .getSvgRootElement()
      .find(`.${SELECTED_SHAPE_CLASS_NAME}`)
      .forEach((shape) => shape.removeClass(`${SELECTED_SHAPE_CLASS_NAME}`));
    this.getSelectedShapesGroup().each(function () {
      this.remove();
    });
    document.dispatchEvent(UserActions.createCustomEvent(new UnselectAllShapes()));
  }

  bringShapeToFront(shape: ShapeInfo<Shape>): void {
    shape.container.forward();
  }

  sendShapeToBack(shape: ShapeInfo<Shape>): void {
    shape.container.backward();
  }

  deleteShape(shape: ShapeInfo<Shape>): void {
    shape.container.remove();
    this.unselectAll();
  }

  draw(shape: ShapeInfo<Shape>): void {
    this.appStateService.getSvgRootElement().add(shape.container);
  }

  getSelectedShapesGroup(): G {
    let selectedShapeGroup = this.selectedShapeGroup;
    if (selectedShapeGroup) return selectedShapeGroup;
    const svg = this.appStateService.getSvgRootElement();
    selectedShapeGroup = svg.findOne(`g.${SELECTED_SHAPE_GROUP_CLASS_NAME}`) as G;
    if (!selectedShapeGroup) selectedShapeGroup = svg.group().addClass(`${SELECTED_SHAPE_GROUP_CLASS_NAME}`);
    this.selectedShapeGroup = selectedShapeGroup;
    return selectedShapeGroup;
  }
}
