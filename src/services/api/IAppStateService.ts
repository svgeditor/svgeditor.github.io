import { Svg } from '@svgdotjs/svg.js';
import { ESvgElement } from '../../models/SvgElement';
import { WhiteboardWindow } from '../../models/WhiteboardLayers';
import { ZoomLevel } from '../../models/ZoomLevel';

export interface IAppStateService {
  getShapeToDraw(): ESvgElement;
  setShapeToDraw(shapeToDraw: ESvgElement): void;
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
