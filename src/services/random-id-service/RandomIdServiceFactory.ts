import { IRandomIdService } from './IRandomIdService';
import { RandomIdService } from './RandomIdService';

export class RandomIdServiceFactory {
  private static instance: IRandomIdService = null;
  create(): IRandomIdService {
    if (RandomIdServiceFactory.instance == null) {
      RandomIdServiceFactory.instance = new RandomIdService();
    }
    return RandomIdServiceFactory.instance;
  }
}
