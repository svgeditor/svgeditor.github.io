import { Svg } from '@svgdotjs/svg.js';
import { AppState } from '../../models/AppState';
import { IAppStateService } from '../api/IAppStateService';

export class AppStateService implements IAppStateService {
  private static instance: IAppStateService = null;
  private appState: AppState = null;
  private svg: Svg;

  static getInstance(): IAppStateService {
    if (AppStateService.instance === null) {
      AppStateService.instance = new AppStateService();
    }
    return AppStateService.instance;
  }

  protected constructor() {}

  setSvg(svg: Svg): void {
    this.svg = svg;
  }
  getSvg(): Svg {
    return this.svg;
  }

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
