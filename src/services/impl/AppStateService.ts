import { G, Svg } from '@svgdotjs/svg.js';
import { AppState } from '../../models/AppState';
import { IAppStateService } from '../api/IAppStateService';
import { SELECTION_GROUP_CLASS_NAME } from './_constants';

export class AppStateService implements IAppStateService {
  private static instance: IAppStateService = null;
  private appState: AppState = new AppState();
  private svg: Svg;
  private selectedShapeGroup: G;

  static getInstance(): IAppStateService {
    if (AppStateService.instance === null) {
      AppStateService.instance = new AppStateService();
    }
    return AppStateService.instance;
  }

  protected constructor() {}

  getWhiteboardWidth(): number {
    return this.appState.whiteboardDimensions.width;
  }

  getWhiteboardHeight(): number {
    return this.appState.whiteboardDimensions.height;
  }

  setSvgRootElement(svg: Svg): void {
    this.svg = svg;
  }

  getSvgRootElement(): Svg {
    return this.svg;
  }

  getAppState(): AppState {
    return JSON.parse(JSON.stringify(this.appState));
  }

  saveAppState(newAppState: AppState): void {
    this.appState = newAppState;
  }

  getSelectedShapesGroup(): G {
    if (this.selectedShapeGroup) return this.selectedShapeGroup;
    const svg = this.getSvgRootElement();
    this.selectedShapeGroup = svg.findOne(`g.${SELECTION_GROUP_CLASS_NAME}`) as G;
    if (!this.selectedShapeGroup) this.selectedShapeGroup = svg.group().addClass(`${SELECTION_GROUP_CLASS_NAME}`);
    return this.selectedShapeGroup;
  }
}
