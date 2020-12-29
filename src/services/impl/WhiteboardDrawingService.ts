import { G } from '@svgdotjs/svg.js';
import { SELECTED_SHAPE_CLASS_NAME, SELECTED_SHAPE_GROUP_CLASS_NAME } from '../../constants/constants';
import { IShapeDrawingService } from '../api/IShapeDrawingService';
import { IWhiteboardDrawingService } from '../api/IWhiteboardDrawingService';
import { RectangleDrawingService } from './RectangleDrawingService';
import { AppStateService } from './AppStateService';
import { UnselectAllShapes } from '../../models/user-actions/UnselectAllShapes';
import { UserActions } from '../../models/user-actions/UserActions';
import { ShapeInfo } from '../../models/ShapeInfo';
import { CircleDrawingService } from './CircleDrawingService';
import { ECursorFunction } from '../../models/ECursorFunction';
import { EllipseDrawingService } from './EllipseDrawingService';
import { LineDrawingService } from './LineDrawingService';

export class WhiteboardDrawingService implements IWhiteboardDrawingService {
  private static instance: IWhiteboardDrawingService = new WhiteboardDrawingService();
  private rectangleDrawingService: IShapeDrawingService;
  private circleDrawingService: IShapeDrawingService;
  private ellipseDrawingService: IShapeDrawingService;
  private lineDrawingService: IShapeDrawingService;
  private selectedShapeGroup: G = null;

  private constructor(
    private appStateService = AppStateService.getInstance(),
    rectangleDrawingService?: IShapeDrawingService,
    circleDrawingService?: IShapeDrawingService,
    ellipseDrawingService?: IShapeDrawingService,
    lineDrawingService?: IShapeDrawingService
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

  select(shape: ShapeInfo): void {
    this.rectangleDrawingService.select(shape);
  }

  move(event: MouseEvent, shape: ShapeInfo): void {
    this.rectangleDrawingService.move(event, shape);
  }

  getStyles(): string {
    return this.rectangleDrawingService.getStyles();
  }

  resize(): void {
    const svg = this.appStateService.getSvgRootElement();
    this.unselectAll();
    svg.find('rect').forEach((shape) => {
      const container = shape.parent() as G;
      this.rectangleDrawingService.resize(new ShapeInfo(container, shape));
    });
    svg.find('circle').forEach((shape) => {
      const container = shape.parent() as G;
      this.circleDrawingService.resize(new ShapeInfo(container, shape));
    });
    svg.find('ellipse').forEach((shape) => {
      const container = shape.parent() as G;
      this.ellipseDrawingService.resize(new ShapeInfo(container, shape));
    });
    svg.find('line').forEach((shape) => {
      const container = shape.parent() as G;
      this.lineDrawingService.resize(new ShapeInfo(container, shape));
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

  bringShapeToFront(shape: ShapeInfo): void {
    shape.container.forward();
  }

  sendShapeToBack(shape: ShapeInfo): void {
    shape.container.backward();
  }

  deleteShape(shape: ShapeInfo): void {
    shape.container.remove();
    this.unselectAll();
  }

  draw(shape: ShapeInfo): void {
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
