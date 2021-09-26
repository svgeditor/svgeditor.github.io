import { ICreateSvgElementService } from './ICreateSvgElementService';

export interface ICreateSvgElementServiceFactory {
  create(): ICreateSvgElementService;
}
