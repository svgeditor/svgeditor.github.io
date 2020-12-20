import { Svg } from '@svgdotjs/svg.js';
import { IRectangleElementService } from './IRectangleElementService';
import { RectangleElementService } from './RectangleElementService';

export class RectangleElementServiceFactory {
  private static instance: IRectangleElementService;

  static create(): IRectangleElementService {
    if (RectangleElementServiceFactory.instance == null) {
      RectangleElementServiceFactory.instance = new RectangleElementService();
    }
    return RectangleElementServiceFactory.instance;
  }
}
