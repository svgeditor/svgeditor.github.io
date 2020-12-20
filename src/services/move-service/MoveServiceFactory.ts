import { IMoveService } from './IMoveService';
import { MoveService } from './MoveService';

export class MoveServiceFactory {
  private static instance: IMoveService;

  static create(): IMoveService {
    if (MoveServiceFactory.instance == null) {
      MoveServiceFactory.instance = new MoveService();
    }
    return MoveServiceFactory.instance;
  }
}
