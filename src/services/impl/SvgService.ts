import { G, Rect, Shape, SVG } from '@svgdotjs/svg.js';
import { SHAPE_CLASS_NAME } from './_constants';
import { ISvgElementService } from '../api/ISvgElementService';
import { ISvgService } from '../api/ISvgService';
import { RectSvgElementService } from './RectSvgElementService';
import { ZoomPercentage } from '../../models/ZoomPercentage';
import { AppStateService } from './AppStateService';

export class SvgService implements ISvgService {
  constructor(private appStateService = AppStateService.getInstance(), private rectService = new RectSvgElementService()) {}

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
      this.rectService.unselectAll();
    }
  }

  getStyles(): string {
    return `
      ${this.rectService.getStyles()}
    `;
  }

  resize(svg = this.appStateService.getSvg(), zoomPercentage: ZoomPercentage = this.appStateService.getZoomPercentage()): void {
    this.rectService.unselectAll();
    svg.find('rect').forEach((rect) => this.rectService.resize(rect));
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
