import { G, Svg } from '@svgdotjs/svg.js';
import { ECursorFunction } from '../../models/ECursorFunction';
import { IUndoableAction } from '../../models/UndoableAction';
import { ZoomLevel } from '../../models/ZoomLevel';

export interface IAppStateService {
  getCursorFunction(): ECursorFunction;
  setCursorFunction(cursorFunction: ECursorFunction): void;
  setSvgRootElement(svg: Svg): void;
  getSvgRootElement(): Svg;
  getWhiteboardWidth(): number;
  getWhiteboardHeight(): number;
  getSelectedShapesGroup(): G;
  setWhiteboardZoomLevel(zoomLevel: ZoomLevel): void;
  getWhiteboardZoomLevel(): ZoomLevel;
  pushUndoableUserAction(action: IUndoableAction): void;
  popUndoableUserAction(): IUndoableAction | undefined;
  getUndoableUserActionsSize(): number;
}
