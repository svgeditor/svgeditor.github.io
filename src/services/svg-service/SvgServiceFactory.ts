import { Svg } from '@svgdotjs/svg.js';
import { ISvgService } from './ISvgService';
import { SvgService } from './SvgService';

export class SvgServiceFactory {
  private static instance: ISvgService;

  static create(): ISvgService {
    if (SvgServiceFactory.instance == null) {
      SvgServiceFactory.instance = new SvgService();
    }
    return SvgServiceFactory.instance;
  }
}
