import { Shape, SVG, Svg } from '@svgdotjs/svg.js';
import { MOVEABLE_CLASS_NAME, SELECTABLE_CLASS_NAME } from '../common/constants';
import { IMoveService } from '../move-service/IMoveService';
import { MoveServiceFactory } from '../move-service/MoveServiceFactory';
import { IRectangleElementService } from '../rectangle-element-service/IRectangleElementService';
import { RectangleElementServiceFactory } from '../rectangle-element-service/RectangleElementServiceFactory';
import { ISelectService } from '../select-service/ISelectService';
import { SelectServiceFactory } from '../select-service/SelectServiceFactory';
import { ISvgService } from './ISvgService';

export class SvgService implements ISvgService {
  private moveService: IMoveService;
  private selectService: ISelectService;
  private rectangleElementService: IRectangleElementService;

  constructor(moveService?: IMoveService, selectService?: ISelectService, rectangleElementService?: IRectangleElementService) {
    this.moveService = moveService ? moveService : MoveServiceFactory.create();
    this.selectService = selectService ? selectService : SelectServiceFactory.create();
    this.rectangleElementService = rectangleElementService ? rectangleElementService : RectangleElementServiceFactory.create();
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
