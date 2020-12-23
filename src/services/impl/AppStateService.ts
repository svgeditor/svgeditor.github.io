import { G, Svg } from '@svgdotjs/svg.js';
import { AppState } from '../../models/AppState';
import { ZoomPercentage } from '../../models/ZoomPercentage';
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

  getSvgWidth(takingIntoAccountZoomPercentage: boolean = true): number {
    if (!takingIntoAccountZoomPercentage) return this.appState.svgDimensions.width;
    return ZoomPercentage.zoom(this.appState.svgDimensions.width, { current: this.getCurrentZoomPercentage(), previous: 100 });
  }

  getSvgHeight(takingIntoAccountZoomPercentage: boolean = true): number {
    if (!takingIntoAccountZoomPercentage) return this.appState.svgDimensions.height;
    return (this.appState.svgDimensions.height * this.getCurrentZoomPercentage()) / 100;
  }

  getZoomPercentage(): ZoomPercentage {
    return this.appState.zoomPercentage;
  }

  getCurrentZoomPercentage(): number {
    return this.appState.zoomPercentage.current;
  }

  reduceZoomPercentageBy(value: number): void {
    this.appState.zoomPercentage.previous = this.appState.zoomPercentage.current;
    this.appState.zoomPercentage.current -= value;
  }

  increaseZoomPercentageBy(value: number): void {
    this.appState.zoomPercentage.previous = this.appState.zoomPercentage.current;
    this.appState.zoomPercentage.current += value;
  }

  setSvg(svg: Svg): void {
    this.svg = svg;
  }

  getSvg(): Svg {
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
    const svg = this.getSvg();
    this.selectedShapeGroup = svg.findOne(`g.${SELECTION_GROUP_CLASS_NAME}`) as G;
    if (!this.selectedShapeGroup) this.selectedShapeGroup = svg.group().addClass(`${SELECTION_GROUP_CLASS_NAME}`);
    return this.selectedShapeGroup;
  }
}
