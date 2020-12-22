import { AppState } from '../api/AppState';
import { IAppStateService } from '../api/IAppStateService';

export class AppStateService implements IAppStateService {
  private static instance: IAppStateService = null;
  private appState: AppState = null;

  static getInstance(): IAppStateService {
    if (AppStateService.instance === null) {
      AppStateService.instance = new AppStateService();
    }
    return AppStateService.instance;
  }

  protected constructor() {}

  getAppState(): AppState {
    if (!this.appState) {
      this.appState = new AppState();
    }
    return JSON.parse(JSON.stringify(this.appState));
  }

  saveAppState(newAppState: AppState): void {
    this.appState = newAppState;
  }
}
