import { Svg } from '@svgdotjs/svg.js';
import { AppState } from '../../models/AppState';

export interface IAppStateService {
  getAppState(): AppState;
  saveAppState(newAppState: AppState): void;
  setSvg(svg: Svg): void;
  getSvg(): Svg;
}
