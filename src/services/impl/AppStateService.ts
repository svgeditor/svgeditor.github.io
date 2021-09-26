import { Svg } from '@svgdotjs/svg.js';
import { Size } from '../../models/Size';
import { MAX_ZOOM_PERCENTAGE, MIN_ZOOM_PERCENTAGE, ZoomLevel, ZOOM_PERCENTAGE_STEP } from '../../models/app-state/ZoomLevel';
import { IAppStateService } from '../IAppStateService';
import { WhiteboardWindow } from '../../models/WhiteboardLayers';
import { ESvgShape } from '../../models/svg-elements/SvgShape';

export class AppStateService implements IAppStateService {
  private static instance: IAppStateService = new AppStateService();
  private whiteboardDimensions = new Size(800, 1100);
  private whiteboardZoomLevel = new ZoomLevel();
  private shapeToDraw: ESvgShape = ESvgShape.RECTANGLE;
  private whiteboardLayers: WhiteboardWindow;
  private zoomLevel = new ZoomLevel();

  static getInstance(): IAppStateService {
    return AppStateService.instance;
  }

  private constructor() {}

  getGridSize(): number {
    return 10;
  }

  getGridBackgroundColor(): string {
    return '#fff';
  }

  getGridColor(): string {
    return '#00000022';
  }

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

  getWhiteboardSize(zoomedValue = false): Size {
    if (zoomedValue) {
      return this.zoomLevel.getZoomedSize(new Size(800, 1100));
    }
    return new Size(800, 1100);
  }

  getZoomLevel(): ZoomLevel {
    return this.zoomLevel;
  }

  increaseZoomLevel() {
    if (this.zoomLevel.currentPercentageZoom == MAX_ZOOM_PERCENTAGE) {
      this.zoomLevel.previousPercentageZoom = MAX_ZOOM_PERCENTAGE;
      return;
    }
    const currentPercentageZoom = this.zoomLevel.currentPercentageZoom;
    this.zoomLevel.previousPercentageZoom = currentPercentageZoom;
    this.zoomLevel.currentPercentageZoom = currentPercentageZoom + ZOOM_PERCENTAGE_STEP;
  }

  decreaseZoomLevel() {
    if (this.zoomLevel.currentPercentageZoom == MIN_ZOOM_PERCENTAGE) {
      this.zoomLevel.previousPercentageZoom = MIN_ZOOM_PERCENTAGE;
      return;
    }
    const currentPercentageZoom = this.zoomLevel.currentPercentageZoom;
    this.zoomLevel.previousPercentageZoom = currentPercentageZoom;
    this.zoomLevel.currentPercentageZoom = currentPercentageZoom - ZOOM_PERCENTAGE_STEP;
  }

  getRulerWidth(): number {
    return 20;
  }

  getRulerColor(): string {
    return '#00000044';
  }
}
