import { MAX_ZOOM_PERCENTAGE, MIN_ZOOM_PERCENTAGE, ZoomLevel, ZOOM_PERCENTAGE_STEP } from '../../models/ZoomLevel';
import { IWhiteboardDrawingService } from '../api/IWhiteboardDrawingService';
import { IWhiteboardLayersService } from '../api/IWhiteboardLayersService';
import { IWhiteboardZoomService } from '../api/IWhiteboardZoomService';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';

export class WhiteboardZoomService implements IWhiteboardZoomService {
  private static zoomLevel: ZoomLevel = null;

  constructor(
    private whiteboardLayersService: IWhiteboardLayersService,
    private whiteboardDrawingService: IWhiteboardDrawingService = new WhiteboardDrawingService()
  ) {}

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
    const zoomScroll = this.whiteboardLayersService.getWhiteboardZoomScroll(event, currentPercentageZoom);
    this.whiteboardLayersService.continueScrollSouthEast(zoomScroll);
  }

  zoomOut(event: WheelEvent): void {
    const zoomLevel = this.getZoomLevel();
    if (zoomLevel.currentPercentageZoom <= MIN_ZOOM_PERCENTAGE) return;
    const currentPercentageZoom = WhiteboardZoomService.zoomLevel.currentPercentageZoom;
    WhiteboardZoomService.zoomLevel.previousPercentageZoom = currentPercentageZoom;
    WhiteboardZoomService.zoomLevel.currentPercentageZoom = currentPercentageZoom - ZOOM_PERCENTAGE_STEP;
    this.whiteboardLayersService.resize(zoomLevel);
    this.whiteboardDrawingService.resize(zoomLevel);
    const zoomScroll = this.whiteboardLayersService.getWhiteboardZoomScroll(event, currentPercentageZoom);
    this.whiteboardLayersService.continueScrollNorthWest(zoomScroll);
  }
}
