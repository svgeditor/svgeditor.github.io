import { G, Shape, SVG } from '@svgdotjs/svg.js';
import { SELECTED_SHAPE_CLASS_NAME, SHAPE_CLASS_NAME } from './_constants';
import { ISvgElementService } from '../api/ISvgElementService';
import { ISvgService } from '../api/ISvgService';
import { RectSvgElementService } from './RectSvgElementService';
import { ZoomPercentage } from '../../models/ZoomPercentage';
import { AppStateService } from './AppStateService';

export class SvgService implements ISvgService {
  private rectService: ISvgElementService;
  constructor(private appStateService = AppStateService.getInstance(), rectService?: ISvgElementService) {
    this.rectService = rectService ? rectService : new RectSvgElementService(this);
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

  resize(svg = this.appStateService.getSvg(), zoomPercentage: ZoomPercentage = this.appStateService.getZoomPercentage()): void {
    this.unselectAll();
    svg.find('rect').forEach((rect) => this.rectService.resize(rect));
  }

  unselectAll(): void {
    this.appStateService
      .getSvg()
      .find(`.${SELECTED_SHAPE_CLASS_NAME}`)
      .forEach((shape) => shape.removeClass(`${SELECTED_SHAPE_CLASS_NAME}`));
    this.appStateService.getSelectedShapesGroup().each(function () {
      this.remove();
    });
  }

  private getSvgElementService(): ISvgElementService {
    return this.rectService;
  }

  private getSvgElementServiceByEventTarget(target: HTMLElement): ISvgElementService {
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
