import { Shape, SVG, Svg } from '@svgdotjs/svg.js';
import { MOVEABLE_CLASS_NAME, SELECTABLE_CLASS_NAME } from './_constants';
import { IMoveService } from '../api/IMoveService';
import { IRectangleElementService } from '../api/IRectangleElementService';
import { ISelectService } from '../api/ISelectService';
import { ISvgService } from '../api/ISvgService';
import { MoveService } from './MoveService';
import { SelectService } from './SelectService';
import { RectangleElementService } from './RectangleElementService';

export class SvgService implements ISvgService {
  private moveService: IMoveService;
  private selectService: ISelectService;
  private rectangleElementService: IRectangleElementService;

  constructor(moveService?: IMoveService, selectService?: ISelectService, rectangleElementService?: IRectangleElementService) {
    this.moveService = moveService ? moveService : new MoveService();
    this.selectService = selectService ? selectService : new SelectService();
    this.rectangleElementService = rectangleElementService ? rectangleElementService : new RectangleElementService();
  }

  handleMouseDownEvent(svg: Svg, event: MouseEvent): void {
    const eventTarget = event.target as HTMLElement;
    if (eventTarget instanceof SVGSVGElement) {
      return this.rectangleElementService.create(svg, event);
    }
    if (eventTarget.classList.contains(MOVEABLE_CLASS_NAME)) {
      return this.moveService.moveElement(event, SVG(eventTarget) as Shape);
    }
  }

  handleClickEvent(svg: Svg, event: MouseEvent): void {
    const eventTarget = event.target as HTMLElement;
    if (eventTarget.classList.contains(SELECTABLE_CLASS_NAME)) {
      return this.selectService.selectElement(svg, SVG(eventTarget) as Shape);
    } else {
      this.selectService.unselectElements(svg);
    }
  }

  getStyles(): string {
    return `
      ${this.rectangleElementService.getStyles()}
      ${this.selectService.getStyles()}
    `;
  }
}
