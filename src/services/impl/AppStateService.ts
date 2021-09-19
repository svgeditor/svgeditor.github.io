import { Svg } from '@svgdotjs/svg.js';
import { Dimensions } from '../../models/Dimensions';
import { ESvgShape } from '../../models/SvgShape';
import { MAX_ZOOM_PERCENTAGE, MIN_ZOOM_PERCENTAGE, ZoomLevel, ZOOM_PERCENTAGE_STEP } from '../../models/ZoomLevel';
import { IAppStateService } from '../IAppStateService';
import { WhiteboardWindow } from '../../models/WhiteboardLayers';

export class AppStateService implements IAppStateService {
  private static instance: IAppStateService = new AppStateService();
  private whiteboardDimensions = new Dimensions(800, 1100);
  private whiteboardZoomLevel = new ZoomLevel();
  private shapeToDraw: ESvgShape = ESvgShape.RECTANGLE;
  private whiteboardLayers: WhiteboardWindow;

  static getInstance(): IAppStateService {
    return AppStateService.instance;
  }

  private constructor() {}

  setWhiteboardWindow(layers: WhiteboardWindow): void {
    this.whiteboardLayers = layers;
  }

  getWhiteboardWindow(): WhiteboardWindow {
    return this.whiteboardLayers;
  }

  getShapeToDraw(): ESvgShape {
    return this.shapeToDraw;
  }
  setShapeToDraw(cursorFunction: ESvgShape): void {
    this.shapeToDraw = cursorFunction;
  }

  getInitialWhiteboardWidth(): number {
    return this.whiteboardDimensions.width;
  }

  getInitialWhiteboardHeight(): number {
    return this.whiteboardDimensions.height;
  }

  getSvgRootElement(): Svg {
    return this.whiteboardLayers.svgRootElement;
  }

  setWhiteboardZoomLevel(zoomLevel: ZoomLevel): void {
    this.whiteboardZoomLevel = zoomLevel;
  }

  getWhiteboardZoomLevel(): ZoomLevel {
    return this.whiteboardZoomLevel;
  }

  increaseWhiteboardZoomLevel() {
    if (this.whiteboardZoomLevel.currentPercentageZoom == MAX_ZOOM_PERCENTAGE) {
      this.whiteboardZoomLevel.previousPercentageZoom = MAX_ZOOM_PERCENTAGE;
      return;
    }
    const currentPercentageZoom = this.whiteboardZoomLevel.currentPercentageZoom;
    this.whiteboardZoomLevel.previousPercentageZoom = currentPercentageZoom;
    this.whiteboardZoomLevel.currentPercentageZoom = currentPercentageZoom + ZOOM_PERCENTAGE_STEP;
  }

  decreaseWhiteboardZoomLevel() {
    if (this.whiteboardZoomLevel.currentPercentageZoom == MIN_ZOOM_PERCENTAGE) {
      this.whiteboardZoomLevel.previousPercentageZoom = MIN_ZOOM_PERCENTAGE;
      return;
    }
    const currentPercentageZoom = this.whiteboardZoomLevel.currentPercentageZoom;
    this.whiteboardZoomLevel.previousPercentageZoom = currentPercentageZoom;
    this.whiteboardZoomLevel.currentPercentageZoom = currentPercentageZoom - ZOOM_PERCENTAGE_STEP;
  }
}
