import { IUserAction } from './IUserAction';

export abstract class UndoableUserAction implements IUserAction {
  abstract undo(): void;
  abstract redo(): void;
}
