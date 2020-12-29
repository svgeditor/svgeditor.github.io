import { G } from '@svgdotjs/svg.js';
import { SELECTED_SHAPE_CLASS_NAME, SELECTED_SHAPE_GROUP_CLASS_NAME } from '../../constants/constants';
import { IShapeService } from '../api/IShapeService';
import { IWhiteboardDrawingService } from '../api/IWhiteboardDrawingService';
import { RectangleShapeService } from './RectangleShapeService';
import { AppStateService } from './AppStateService';
import { UnselectAllShapes } from '../../models/user-actions/UnselectAllShapes';
import { UserActions } from '../../models/user-actions/UserActions';
import { ShapeInfo } from '../../models/ShapeInfo';
import { CircleShapeService } from './CircleShapeService';
import { ECursorFunction } from '../../models/ECursorFunction';
import { EllipseShapeService } from './EllipseShapeService';

export class WhiteboardDrawingService implements IWhiteboardDrawingService {
  private static instance: IWhiteboardDrawingService = new WhiteboardDrawingService();
  private rectangleShapeService: IShapeService;
  private circleShapeService: IShapeService;
  private ellipseShapeService: IShapeService;
  private selectedShapeGroup: G = null;

  private constructor(
    private appStateService = AppStateService.getInstance(),
    rectangleShapeService?: IShapeService,
    circleShapeService?: IShapeService,
    ellipseShapeService?: IShapeService
  ) {
    this.rectangleShapeService = rectangleShapeService ? rectangleShapeService : RectangleShapeService.getInstance(this);
    this.circleShapeService = circleShapeService ? circleShapeService : CircleShapeService.getInstance(this);
    this.ellipseShapeService = ellipseShapeService ? ellipseShapeService : EllipseShapeService.getInstance(this);
  }

  static getInstance(): IWhiteboardDrawingService {
    return WhiteboardDrawingService.instance;
  }

  createShapeOnMouseDown(event: MouseEvent): void {
    const cursorFunction = this.appStateService.getCursorFunction();
    switch (cursorFunction) {
      case ECursorFunction.DRAW_RECTANGLES:
        return this.rectangleShapeService.createOnMouseDown(event);
      case ECursorFunction.DRAW_CIRCLES:
        return this.circleShapeService.createOnMouseDown(event);
      case ECursorFunction.DRAW_ELLIPSES:
        return this.ellipseShapeService.createOnMouseDown(event);
      default:
        return this.rectangleShapeService.createOnMouseDown(event);
    }
  }

  select(shape: ShapeInfo): void {
    this.rectangleShapeService.select(shape);
  }

  move(event: MouseEvent, shape: ShapeInfo): void {
    this.rectangleShapeService.move(event, shape);
  }

  getStyles(): string {
    return this.rectangleShapeService.getStyles();
  }

  resize(): void {
    const svg = this.appStateService.getSvgRootElement();
    this.unselectAll();
    svg.find('rect').forEach((shape) => {
      const container = shape.parent() as G;
      this.rectangleShapeService.resize(new ShapeInfo(container, shape));
    });
    svg.find('circle').forEach((shape) => {
      const container = shape.parent() as G;
      this.circleShapeService.resize(new ShapeInfo(container, shape));
    });
    svg.find('ellipse').forEach((shape) => {
      const container = shape.parent() as G;
      this.ellipseShapeService.resize(new ShapeInfo(container, shape));
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
