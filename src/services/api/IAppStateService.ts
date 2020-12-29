import { Svg } from '@svgdotjs/svg.js';
import { ECursorFunction } from '../../models/ECursorFunction';
import { WhiteboardWindow } from '../../models/WhiteboardLayers';
import { ZoomLevel } from '../../models/ZoomLevel';

export interface IAppStateService {
  getCursorFunction(): ECursorFunction;
  setCursorFunction(cursorFunction: ECursorFunction): void;
  getSvgRootElement(): Svg;
  setWhiteboardWindow(whiteboardWindow: WhiteboardWindow): void;
  getWhiteboardWindow(): WhiteboardWindow;
  getInitialWhiteboardWidth(): number;
  getInitialWhiteboardHeight(): number;
  setWhiteboardZoomLevel(zoomLevel: ZoomLevel): void;
  getWhiteboardZoomLevel(): ZoomLevel;
  increaseWhiteboardZoomLevel();
  decreaseWhiteboardZoomLevel();
}
