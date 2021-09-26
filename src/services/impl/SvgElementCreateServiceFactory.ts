import { ISvgElementCreateService } from '../ISvgElementCreateService';
import { ISvgElementCreateServiceFactory } from '../ISvgElementCreateServiceFactory';
import { SvgRectangleCreateService } from './SvgRectangleCreateService';

export class SvgElementCreateServiceFactory implements ISvgElementCreateServiceFactory {
  private svgRectangleCreateService = new SvgRectangleCreateService();

  create(): ISvgElementCreateService {
    return this.svgRectangleCreateService;
  }
}
