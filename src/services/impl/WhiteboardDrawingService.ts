import { G, Shape, SVG } from '@svgdotjs/svg.js';
import { SELECTED_SHAPE_CLASS_NAME, SHAPE_CLASS_NAME } from './_constants';
import { IShapeService } from '../api/IShapeService';
import { IWhiteboardDrawingService } from '../api/IWhiteboardDrawingService';
import { RectShapeService } from './RectShapeService';
import { AppStateService } from './AppStateService';
import { DeleteSelectedShapesAction } from '../../models/UndoableAction';
import { SELECTED_SHAPES_DELETED_EVENT, UNSELECT_ALL_SHAPES_EVENT } from '../../models/CustomEvents';

export class WhiteboardDrawingService implements IWhiteboardDrawingService {
  private rectService: IShapeService;
  constructor(private appStateService = AppStateService.getInstance(), rectService?: IShapeService) {
    this.rectService = rectService ? rectService : new RectShapeService(this);
  }

  handleMouseDownEvent(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target instanceof SVGSVGElement) {
      return this.getSvgElementService().createOnMouseDown(event);
    }
    if (target.classList.contains(SHAPE_CLASS_NAME)) {
      return this.getSvgElementServiceByEventTarget(target).move(event, this.toShape(target));
    }
  }

  handleClickEvent(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains(SHAPE_CLASS_NAME)) {
      return this.getSvgElementServiceByEventTarget(target).select(this.toShape(target));
    } else {
      this.unselectAll();
    }
  }

  getStyles(): string {
    return `
      ${this.rectService.getStyles()}
    `;
  }

  resize(): void {
    const svg = this.appStateService.getSvgRootElement();
    this.unselectAll();
    svg.find('rect').forEach((rect) => this.rectService.resize(rect));
  }

  unselectAll(): void {
    this.appStateService
      .getSvgRootElement()
      .find(`.${SELECTED_SHAPE_CLASS_NAME}`)
      .forEach((shape) => shape.removeClass(`${SELECTED_SHAPE_CLASS_NAME}`));
    this.appStateService.getSelectedShapesGroup().each(function () {
      this.remove();
      document.dispatchEvent(UNSELECT_ALL_SHAPES_EVENT);
    });
  }

  bringSelectedShapesToFront(): void {
    this.appStateService
      .getSvgRootElement()
      .find(`.${SELECTED_SHAPE_CLASS_NAME}`)
      .forEach((shape) => shape.forward());
  }

  sendSelectedShapesToBack(): void {
    this.appStateService
      .getSvgRootElement()
      .find(`.${SELECTED_SHAPE_CLASS_NAME}`)
      .forEach((shape) => shape.backward());
  }

  deleteSelectedShapes(): void {
    const selectedShapes = this.appStateService.getSvgRootElement().find(`.${SELECTED_SHAPE_CLASS_NAME}`);
    this.appStateService.pushUndoableUserAction(new DeleteSelectedShapesAction(selectedShapes, this));
    selectedShapes.forEach((shape) => shape.remove());
    this.appStateService.getSelectedShapesGroup().each(function () {
      this.remove();
      document.dispatchEvent(SELECTED_SHAPES_DELETED_EVENT);
    });
  }

  draw(shape: Shape): void {
    this.appStateService.getSvgRootElement().add(shape);
  }

  private getSvgElementService(): IShapeService {
    return this.rectService;
  }

  private getSvgElementServiceByEventTarget(target: HTMLElement): IShapeService {
    const shapeName = target.tagName.toUpperCase();
    switch (shapeName) {
      case 'RECT':
        return this.rectService;
      default:
        throw Error('Unsupported shape: ' + shapeName);
    }
  }

  private toShape(eventTarget): Shape {
    let res = SVG(eventTarget) as Shape;
    while (res.parent() instanceof G) {
      res = res.parent() as G;
    }
    return res as G;
  }
}
