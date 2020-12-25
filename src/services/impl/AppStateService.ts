import { G, Svg } from '@svgdotjs/svg.js';
import { AppState } from '../../models/AppState';
import { ZoomLevel } from '../../models/ZoomLevel';
import { IAppStateService } from '../api/IAppStateService';
import { SELECTION_GROUP_CLASS_NAME } from './_constants';

export class AppStateService implements IAppStateService {
  private static appState: AppState = new AppState();
  private static instance: IAppStateService = new AppStateService();

  static getInstance(): IAppStateService {
    return this.instance;
  }

  private constructor() {}

  getWhiteboardWidth(): number {
    return AppStateService.appState.whiteboardDimensions.width;
  }

  getWhiteboardHeight(): number {
    return AppStateService.appState.whiteboardDimensions.height;
  }

  setSvgRootElement(svg: Svg): void {
    AppStateService.appState.whiteboardSvgRootElement = svg;
  }

  getSvgRootElement(): Svg {
    return AppStateService.appState.whiteboardSvgRootElement;
  }

  getSelectedShapesGroup(): G {
    let selectedShapeGroup = AppStateService.appState.selectedShapeGroup;
    if (selectedShapeGroup) return selectedShapeGroup;
    const svg = this.getSvgRootElement();
    selectedShapeGroup = svg.findOne(`g.${SELECTION_GROUP_CLASS_NAME}`) as G;
    if (!selectedShapeGroup) selectedShapeGroup = svg.group().addClass(`${SELECTION_GROUP_CLASS_NAME}`);
    AppStateService.appState.selectedShapeGroup = selectedShapeGroup;
    return selectedShapeGroup;
  }

  setWhiteboardZoomLevel(zoomLevel: ZoomLevel): void {
    AppStateService.appState.whiteboardZoomLevel = zoomLevel;
  }
  getWhiteboardZoomLevel(): ZoomLevel {
    return AppStateService.appState.whiteboardZoomLevel;
  }
}
