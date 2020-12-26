import { G, Svg } from '@svgdotjs/svg.js';
import { NEW_UNDOABLE_ACTION_EVENT } from '../../models/CustomEvents';
import { Dimensions } from '../../models/Dimensions';
import { Stack } from '../../models/Stack';
import { IUndoableAction } from '../../models/UndoableAction';
import { ZoomLevel } from '../../models/ZoomLevel';
import { IAppStateService } from '../api/IAppStateService';
import { SELECTION_GROUP_CLASS_NAME } from './_constants';

export class AppStateService implements IAppStateService {
  private static instance: IAppStateService = new AppStateService();
  private whiteboardDimensions = new Dimensions(800, 1100);
  private whiteboardZoomLevel = new ZoomLevel();
  private whiteboardSvgRootElement: Svg = null;
  private selectedShapeGroup: G = null;
  private undoableUserActions = new Stack<IUndoableAction>();

  static getInstance(): IAppStateService {
    return AppStateService.instance;
  }

  private constructor() {}

  pushUndoableUserAction(action: IUndoableAction): void {
    this.undoableUserActions.push(action);
    document.dispatchEvent(NEW_UNDOABLE_ACTION_EVENT);
  }

  popUndoableUserAction(): IUndoableAction {
    return this.undoableUserActions.pop();
  }

  getUndoableUserActionsSize(): number {
    return this.undoableUserActions.size();
  }

  getWhiteboardWidth(): number {
    return this.whiteboardDimensions.width;
  }

  getWhiteboardHeight(): number {
    return this.whiteboardDimensions.height;
  }

  setSvgRootElement(svg: Svg): void {
    this.whiteboardSvgRootElement = svg;
  }

  getSvgRootElement(): Svg {
    return this.whiteboardSvgRootElement;
  }

  getSelectedShapesGroup(): G {
    let selectedShapeGroup = this.selectedShapeGroup;
    if (selectedShapeGroup) return selectedShapeGroup;
    const svg = this.getSvgRootElement();
    selectedShapeGroup = svg.findOne(`g.${SELECTION_GROUP_CLASS_NAME}`) as G;
    if (!selectedShapeGroup) selectedShapeGroup = svg.group().addClass(`${SELECTION_GROUP_CLASS_NAME}`);
    this.selectedShapeGroup = selectedShapeGroup;
    return selectedShapeGroup;
  }

  setWhiteboardZoomLevel(zoomLevel: ZoomLevel): void {
    this.whiteboardZoomLevel = zoomLevel;
  }
  getWhiteboardZoomLevel(): ZoomLevel {
    return this.whiteboardZoomLevel;
  }
}
