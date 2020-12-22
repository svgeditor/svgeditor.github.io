import { AppState } from './AppState';

export interface IAppStateService {
  getAppState(): AppState;
  saveAppState(newAppState: AppState): void;
}
