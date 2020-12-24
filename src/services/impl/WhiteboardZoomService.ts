import { ScrollInfo } from '../../models/ScrollInfo';
import { ZoomLevel, ZOOM_PERCENTAGE_STEP } from '../../models/ZoomLevel';
import { IWhiteboardDrawingService } from '../api/IWhiteboardDrawingService';
import { IWhiteboardLayersService } from '../api/IWhiteboardLayersService';
import { IWhiteboardZoomService } from '../api/IWhiteboardZoomService';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';

export const MAX_ZOOM_PERCENTAGE = 600;
export const MIN_ZOOM_PERCENTAGE = 25;
const CTRL_KEY_CODE = 17;

export class WhiteboardZoomService implements IWhiteboardZoomService {
  private static zoomLevel: ZoomLevel = null;
  private static zoomScrollInfo: ScrollInfo = null;

  constructor(
    private whiteboardLayersService: IWhiteboardLayersService,
    private whiteboardDrawingService: IWhiteboardDrawingService = new WhiteboardDrawingService()
  ) {
    document.addEventListener('keyup', (event) => this.handleKeyupEvent(event));
  }

  handleZoomEvent(event: WheelEvent): void {
    if (event.deltaY < 0) {
      this.zoomIn(event);
    } else {
      this.zoomOut(event);
    }
  }

  getZoomLevel(): ZoomLevel {
    if (!WhiteboardZoomService.zoomLevel) {
      WhiteboardZoomService.zoomLevel = new ZoomLevel();
    }
    return WhiteboardZoomService.zoomLevel;
  }

  zoomIn(event: WheelEvent): void {
    const zoomLevel = this.getZoomLevel();
    if (zoomLevel.currentPercentageZoom >= MAX_ZOOM_PERCENTAGE) return;
    const currentPercentageZoom = WhiteboardZoomService.zoomLevel.currentPercentageZoom;
    WhiteboardZoomService.zoomLevel.previousPercentageZoom = currentPercentageZoom;
    WhiteboardZoomService.zoomLevel.currentPercentageZoom = currentPercentageZoom + ZOOM_PERCENTAGE_STEP;
    this.whiteboardLayersService.resize(zoomLevel);
    this.whiteboardDrawingService.resize(zoomLevel);
    if (!WhiteboardZoomService.zoomScrollInfo) {
      WhiteboardZoomService.zoomScrollInfo = this.whiteboardLayersService.getWhiteboardZoomScroll(event, currentPercentageZoom);
    }
    this.whiteboardLayersService.continueScrollSouthEast(WhiteboardZoomService.zoomScrollInfo);
  }

  zoomOut(event: WheelEvent): void {
    const zoomLevel = this.getZoomLevel();
    if (zoomLevel.currentPercentageZoom <= MIN_ZOOM_PERCENTAGE) return;
    const currentPercentageZoom = WhiteboardZoomService.zoomLevel.currentPercentageZoom;
    WhiteboardZoomService.zoomLevel.previousPercentageZoom = currentPercentageZoom;
    WhiteboardZoomService.zoomLevel.currentPercentageZoom = currentPercentageZoom - ZOOM_PERCENTAGE_STEP;
    this.whiteboardLayersService.resize(zoomLevel);
    this.whiteboardDrawingService.resize(zoomLevel);
    if (!WhiteboardZoomService.zoomScrollInfo) {
      WhiteboardZoomService.zoomScrollInfo = this.whiteboardLayersService.getWhiteboardZoomScroll(event, currentPercentageZoom);
    }
    this.whiteboardLayersService.continueScrollNorthWest(WhiteboardZoomService.zoomScrollInfo);
  }

  private handleKeyupEvent(event: KeyboardEvent) {
    if (event.keyCode == CTRL_KEY_CODE) {
      console.debug('reset zoom scroll info on ctrl keyup event');
      WhiteboardZoomService.zoomScrollInfo = null;
    }
  }
}
