import { G, Svg } from '@svgdotjs/svg.js';
import { ZoomLevel } from '../../models/ZoomLevel';

export interface IAppStateService {
  setSvgRootElement(svg: Svg): void;
  getSvgRootElement(): Svg;
  getWhiteboardWidth(): number;
  getWhiteboardHeight(): number;
  getSelectedShapesGroup(): G;
  setWhiteboardZoomLevel(zoomLevel: ZoomLevel): void;
  getWhiteboardZoomLevel(): ZoomLevel;
}
