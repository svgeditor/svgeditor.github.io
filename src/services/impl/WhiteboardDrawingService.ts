import { G } from '@svgdotjs/svg.js';
import { SELECTED_SHAPE_CLASS_NAME, SELECTED_SHAPE_GROUP_CLASS_NAME } from '../../constants/constants';
import { IShapeService } from '../api/IShapeService';
import { IWhiteboardDrawingService } from '../api/IWhiteboardDrawingService';
import { RectShapeService } from './RectShapeService';
import { AppStateService } from './AppStateService';
import { UnselectAllShapes } from '../../models/user-actions/UnselectAllShapes';
import { UserActions } from '../../models/user-actions/UserActions';
import { ShapeInfo } from '../../models/ShapeInfo';

export class WhiteboardDrawingService implements IWhiteboardDrawingService {
  private static instance: IWhiteboardDrawingService = new WhiteboardDrawingService();
  private rectService: IShapeService;
  private selectedShapeGroup: G = null;

  private constructor(private appStateService = AppStateService.getInstance(), rectService?: IShapeService) {
    this.rectService = rectService ? rectService : RectShapeService.getInstance(this);
  }

  static getInstance(): IWhiteboardDrawingService {
    return WhiteboardDrawingService.instance;
  }

  createShapeOnMouseDown(event: MouseEvent): void {
    this.rectService.createOnMouseDown(event);
  }

  select(shape: ShapeInfo): void {
    this.rectService.select(shape);
  }

  move(event: MouseEvent, shape: ShapeInfo): void {
    this.rectService.move(event, shape);
  }

  getStyles(): string {
    return this.rectService.getStyles();
  }

  resize(): void {
    const svg = this.appStateService.getSvgRootElement();
    this.unselectAll();
    svg.find('rect').forEach((shape) => {
      const container = shape.parent() as G;
      this.rectService.resize(new ShapeInfo(container, shape));
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
