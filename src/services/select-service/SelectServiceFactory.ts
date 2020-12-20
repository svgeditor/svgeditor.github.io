import { ISelectService } from './ISelectService';
import { SelectService } from './SelectService';

export class SelectServiceFactory {
  private static instance: ISelectService;

  static create(): ISelectService {
    if (SelectServiceFactory.instance == null) {
      SelectServiceFactory.instance = new SelectService();
    }
    return SelectServiceFactory.instance;
  }
}
