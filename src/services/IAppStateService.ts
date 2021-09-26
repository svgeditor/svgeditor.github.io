import { Svg } from '@svgdotjs/svg.js';
import { Size } from '../models/Size';
import { ESvgShape } from '../models/svg-elements/SvgShape';
import { WhiteboardWindow } from '../models/WhiteboardLayers';
import { ZoomLevel } from '../models/app-state/ZoomLevel';

export interface IAppStateService {
  getGridBackgroundColor(): string;
  getGridColor(): string;
  getGridSize(): number;

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
  getWhiteboardSize(zoomedValue?: boolean): Size;
  getZoomLevel(): ZoomLevel;
  increaseZoomLevel();
  decreaseZoomLevel();
  getRulerWidth(): number;
  getRulerColor(): string;
}
