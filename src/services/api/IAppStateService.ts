import { G, Svg } from '@svgdotjs/svg.js';
import { AppState } from '../../models/AppState';

export interface IAppStateService {
  getAppState(): AppState;
  saveAppState(newAppState: AppState): void;
  setSvgRootElement(svg: Svg): void;
  getSvgRootElement(): Svg;
  getWhiteboardWidth(): number;
  getWhiteboardHeight(): number;
  getSelectedShapesGroup(): G;
}
