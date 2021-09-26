import { ICreateSvgElementService } from '../ICreateSvgElementService';
import { ICreateSvgElementServiceFactory } from '../ICreateSvgElementServiceFactory';
import { CreateSvgRectangleService } from './CreateSvgRectangleService';

export class CreateSvgElementServiceFactory implements ICreateSvgElementServiceFactory {
  private svgRectangleCreateService = new CreateSvgRectangleService();

  create(): ICreateSvgElementService {
    return this.svgRectangleCreateService;
  }
}
