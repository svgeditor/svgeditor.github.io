import { Svg } from '@svgdotjs/svg.js';
import { ESvgShape } from '../../models/SvgShape';
import { WhiteboardWindow } from '../../models/WhiteboardLayers';
import { ZoomLevel } from '../../models/ZoomLevel';

export interface IAppStateService {
  getShapeToDraw(): ESvgShape;
  setShapeToDraw(shapeToDraw: ESvgShape): void;
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
