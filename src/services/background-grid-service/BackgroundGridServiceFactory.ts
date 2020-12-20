import { BackgroundGridService } from './BackgroundGridService';
import { IBackgroundGridService } from './IBackgroundGridService';

export class BackgroundGridServiceFactory {
  private static instance: IBackgroundGridService = null;
  static create(): IBackgroundGridService {
    if (BackgroundGridServiceFactory.instance == null) {
      BackgroundGridServiceFactory.instance = new BackgroundGridService();
    }
    return BackgroundGridServiceFactory.instance;
  }
}
