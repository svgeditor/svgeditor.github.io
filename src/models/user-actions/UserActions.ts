import { USER_ACTION_EVENT_NAME } from '../../constants/constants';
import { IUserAction } from './IUserAction';

export class UserActions {
  static createCustomEvent<T extends IUserAction>(detail: T): CustomEvent<T> {
    return new CustomEvent<T>(USER_ACTION_EVENT_NAME, {
      detail,
    });
  }
}
