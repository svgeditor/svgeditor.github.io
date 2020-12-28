import { G, Svg } from '@svgdotjs/svg.js';
import { ECursorFunction } from '../../models/ECursorFunction';
import { WhiteboardLayers } from '../../models/WhiteboardLayers';
import { ZoomLevel } from '../../models/ZoomLevel';

export interface IAppStateService {
  getCursorFunction(): ECursorFunction;
  setCursorFunction(cursorFunction: ECursorFunction): void;
  getSvgRootElement(): Svg;
  setWhiteboardLayers(layers: WhiteboardLayers): void;
  getWhiteboardLayers(): WhiteboardLayers;
  getInitialWhiteboardWidth(): number;
  getInitialWhiteboardHeight(): number;
  setWhiteboardZoomLevel(zoomLevel: ZoomLevel): void;
  getWhiteboardZoomLevel(): ZoomLevel;
  increaseWhiteboardZoomLevel();
  decreaseWhiteboardZoomLevel();
}
