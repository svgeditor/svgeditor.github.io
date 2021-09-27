import { ICreateSvgElementService } from '../ICreateSvgElementService';
import { ICreateSvgElementServiceFactory } from '../ICreateSvgElementServiceFactory';
import { CreateSvgRectangleService } from './CreateSvgRectangleService';

export class CreateSvgElementServiceFactory implements ICreateSvgElementServiceFactory {
  private createSvgRectangleService = new CreateSvgRectangleService();

  create(): ICreateSvgElementService {
    return this.createSvgRectangleService;
  }
}
