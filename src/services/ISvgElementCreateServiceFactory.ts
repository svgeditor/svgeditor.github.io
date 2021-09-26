import { ISvgElementCreateService } from './ISvgElementCreateService';

export interface ISvgElementCreateServiceFactory {
  create(): ISvgElementCreateService;
}
