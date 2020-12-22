import { G, Shape, SVG, Svg } from '@svgdotjs/svg.js';
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

  handleMouseDownEvent(event: MouseEvent, svg: Svg): void {
    const eventTarget = event.target as HTMLElement;
    if (eventTarget instanceof SVGSVGElement) {
      return this.rectangleElementService.create(event, svg);
    }
    if (eventTarget.classList.contains(MOVEABLE_CLASS_NAME)) {
      this.selectService.selectElement(svg, SVG(eventTarget).parent() as G);
      return this.moveService.moveElement(event, svg, SVG(eventTarget) as Shape);
    }
  }

  handleClickEvent(event: MouseEvent, svg: Svg): void {
    const eventTarget = event.target as HTMLElement;
    if (eventTarget.classList.contains(SELECTABLE_CLASS_NAME)) {
      return this.selectService.selectElement(svg, SVG(eventTarget).parent() as G);
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
