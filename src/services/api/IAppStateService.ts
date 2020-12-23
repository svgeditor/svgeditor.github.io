import { Svg } from '@svgdotjs/svg.js';
import { AppState } from '../../models/AppState';
import { ZoomPercentage } from '../../models/ZoomPercentage';

export interface IAppStateService {
  getAppState(): AppState;
  saveAppState(newAppState: AppState): void;
  setSvg(svg: Svg): void;
  getSvg(): Svg;
  getZoomPercentage(): ZoomPercentage;
  getCurrentZoomPercentage(): number;
  reduceZoomPercentageBy(value: number): void;
  increaseZoomPercentageBy(value: number): void;
  getSvgWidth(): number;
  getSvgWidth(takingIntoAccountZoomPercentage: boolean): number;
  getSvgHeight(): number;
  getSvgHeight(takingIntoAccountZoomPercentage: boolean): number;
}
