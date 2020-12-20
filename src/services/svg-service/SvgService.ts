import { Rect, SVG, Svg } from '@svgdotjs/svg.js';
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
    this.selectService.unselectElements(svg);
    const eventTarget = event.target as HTMLElement;
    const eventTargetTagName = eventTarget.tagName;
    switch (eventTargetTagName.toLowerCase()) {
      case 'svg': {
        this.rectangleElementService.create(svg, event);
        break;
      }
      case 'rect': {
        this.moveService.moveElement(event, SVG(eventTarget) as Rect);
        break;
      }
      default: {
        console.debug('unknown tag: ' + eventTargetTagName);
      }
    }
  }

  handleClickEvent(svg: Svg, event: MouseEvent): void {
    const eventTarget = event.target as HTMLElement;
    const eventTargetTagName = eventTarget.tagName;
    switch (eventTargetTagName.toLowerCase()) {
      case 'rect': {
        this.selectService.selectElement(svg, SVG(eventTarget) as Rect);
        break;
      }
      default: {
        this.selectService.unselectElements(svg);
      }
    }
  }

  getStyles(): string {
    return `
      ${this.rectangleElementService.getStyles()}
      ${this.selectService.getStyles()}
    `;
  }
}
