import { Position } from '../../models/Position';
import { ScrollInfo } from '../../models/ScrollInfo';
import { WhiteboardLayers } from '../../models/WhiteboardLayers';
import { MAX_ZOOM_PERCENTAGE, MIN_ZOOM_PERCENTAGE, ZoomLevel, ZOOM_PERCENTAGE_STEP } from '../../models/ZoomLevel';
import { IWhiteboardDrawingService } from '../api/IWhiteboardDrawingService';
import { IWhiteboardGridService } from '../api/IWhiteboardGridService';
import { IWhiteboardLayersService } from '../api/IWhiteboardLayersService';
import { AppStateService } from './AppStateService';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { WhiteboardGridService } from './WhiteboardGridService';

const WHITEBOARD_MARGIN = 25;

export class WhiteboardLayersService implements IWhiteboardLayersService {
  private static whiteboardLayers: WhiteboardLayers = null;
  private static zoomLevel: ZoomLevel = null;

  constructor(
    private appStateService = AppStateService.getInstance(),
    private whiteboardGridService: IWhiteboardGridService = new WhiteboardGridService(),
    private whiteboardDrawingService: IWhiteboardDrawingService = new WhiteboardDrawingService()
  ) {}

  init(layers: WhiteboardLayers): void {
    const whiteboardWindowBoundingRect = layers.whiteboardWindow.getBoundingClientRect();
    const whiteboardWidth = this.appStateService.getWhiteboardWidth();
    const whiteboardHeight = this.appStateService.getWhiteboardHeight();
    layers.whiteboard.style.width = `${whiteboardWidth}px`;
    layers.whiteboard.style.height = `${whiteboardHeight}px`;
    layers.whiteboard.style.left = `${whiteboardWindowBoundingRect.width - WHITEBOARD_MARGIN}px`;
    layers.whiteboard.style.top = `${whiteboardWindowBoundingRect.height - WHITEBOARD_MARGIN}px`;
    layers.whiteboardBackground.style.width = `${whiteboardWindowBoundingRect.width * 2 + whiteboardWidth - 2 * WHITEBOARD_MARGIN}px`;
    layers.whiteboardBackground.style.height = `${whiteboardWindowBoundingRect.height * 2 + whiteboardHeight - 2 * WHITEBOARD_MARGIN}px`;
    const whiteboardBackgroundBoundingRect = layers.whiteboardBackground.getBoundingClientRect();
    const scrollX =
      whiteboardWidth < whiteboardWindowBoundingRect.width
        ? whiteboardBackgroundBoundingRect.width / 2 - whiteboardWindowBoundingRect.width / 2
        : whiteboardWindowBoundingRect.width - WHITEBOARD_MARGIN * 2;
    const scrollY =
      whiteboardHeight < whiteboardWindowBoundingRect.height
        ? whiteboardBackgroundBoundingRect.height / 2 - whiteboardWindowBoundingRect.height / 2
        : whiteboardWindowBoundingRect.height - WHITEBOARD_MARGIN * 2;
    layers.whiteboardWindow.scrollTo(scrollX, scrollY);
    this.whiteboardGridService.init(layers);
    WhiteboardLayersService.whiteboardLayers = layers;
  }

  zoomIn(event: WheelEvent): void {
    const zoomLevel = this.getZoomLevel();
    if (zoomLevel.currentPercentageZoom >= MAX_ZOOM_PERCENTAGE) return;
    const currentPercentageZoom = WhiteboardLayersService.zoomLevel.currentPercentageZoom;
    WhiteboardLayersService.zoomLevel.previousPercentageZoom = currentPercentageZoom;
    WhiteboardLayersService.zoomLevel.currentPercentageZoom = currentPercentageZoom + ZOOM_PERCENTAGE_STEP;
    this.resize(zoomLevel);
    this.whiteboardDrawingService.resize(zoomLevel);
    const zoomScroll = this.getWhiteboardZoomScroll(event, currentPercentageZoom);
    this.continueScrollSouthEast(zoomScroll);
  }

  zoomOut(event: WheelEvent): void {
    const zoomLevel = this.getZoomLevel();
    if (zoomLevel.currentPercentageZoom <= MIN_ZOOM_PERCENTAGE) return;
    const currentPercentageZoom = WhiteboardLayersService.zoomLevel.currentPercentageZoom;
    WhiteboardLayersService.zoomLevel.previousPercentageZoom = currentPercentageZoom;
    WhiteboardLayersService.zoomLevel.currentPercentageZoom = currentPercentageZoom - ZOOM_PERCENTAGE_STEP;
    this.resize(zoomLevel);
    this.whiteboardDrawingService.resize(zoomLevel);
    const zoomScroll = this.getWhiteboardZoomScroll(event, currentPercentageZoom);
    this.continueScrollNorthWest(zoomScroll);
  }

  getMousePositionRelatedToWhiteboardContainer(event: MouseEvent): Position {
    const layers = WhiteboardLayersService.whiteboardLayers;
    if (!layers) throw Error('the WhiteboardLayersService service is not yet initialized. please call the init() method before');
    const whiteboardWindowBoundingRect = layers.whiteboardWindow.getBoundingClientRect();
    const whiteboardBackgroundBoundingRect = layers.whiteboardBackground.getBoundingClientRect();
    return {
      x: event.clientX - whiteboardBackgroundBoundingRect.x - (whiteboardWindowBoundingRect.width - WHITEBOARD_MARGIN),
      y: event.clientY - whiteboardBackgroundBoundingRect.y - (whiteboardWindowBoundingRect.height - WHITEBOARD_MARGIN),
    };
  }

  getWhiteboardZoomScroll(event: WheelEvent, zoomPercentage: number): ScrollInfo {
    const mousePositionRelatedToWhiteboardContainer = this.getMousePositionRelatedToWhiteboardContainer(event);
    const scrollX = Math.floor((mousePositionRelatedToWhiteboardContainer.x * ZOOM_PERCENTAGE_STEP) / zoomPercentage);
    const scrollY = Math.floor((mousePositionRelatedToWhiteboardContainer.y * ZOOM_PERCENTAGE_STEP) / zoomPercentage);
    return {
      scrollX,
      scrollY,
      continueScroll: true,
    };
  }

  resize(zoomLevel: ZoomLevel): void {
    const layers = WhiteboardLayersService.whiteboardLayers;
    if (!layers) throw Error('the WhiteboardLayersService service is not yet initialized. please call the init() method before');
    const whiteboardWindowBoundingRect = layers.whiteboardWindow.getBoundingClientRect();
    const whiteboardWidth = zoomLevel.getZoomedValueFromInitialValue(this.appStateService.getWhiteboardWidth());
    const whiteboardHeight = zoomLevel.getZoomedValueFromInitialValue(this.appStateService.getWhiteboardWidth());
    layers.whiteboard.style.width = `${whiteboardWidth}px`;
    layers.whiteboard.style.height = `${whiteboardHeight}px`;
    layers.whiteboardBackground.style.width = `${whiteboardWindowBoundingRect.width * 2 + whiteboardWidth - 2 * WHITEBOARD_MARGIN}px`;
    layers.whiteboardBackground.style.height = `${whiteboardWindowBoundingRect.height * 2 + whiteboardHeight - 2 * WHITEBOARD_MARGIN}px`;
    this.whiteboardGridService.resize(layers, zoomLevel);
  }

  continueScrollNorthWest(scrollInfo: ScrollInfo): void {
    const layers = WhiteboardLayersService.whiteboardLayers;
    if (!layers) throw Error('the WhiteboardLayersService service is not yet initialized. please call the init() method before');
    if (scrollInfo.continueScroll) {
      layers.whiteboardWindow.scrollTo(
        layers.whiteboardWindow.scrollLeft - scrollInfo.scrollX,
        layers.whiteboardWindow.scrollTop - scrollInfo.scrollY
      );
    } else {
      layers.whiteboardWindow.scrollTo(scrollInfo.scrollX, scrollInfo.scrollY);
    }
  }

  continueScrollSouthEast(scrollInfo: ScrollInfo): void {
    const layers = WhiteboardLayersService.whiteboardLayers;
    if (!layers) throw Error('the WhiteboardLayersService service is not yet initialized. please call the init() method before');
    if (scrollInfo.continueScroll) {
      layers.whiteboardWindow.scrollTo(
        layers.whiteboardWindow.scrollLeft + scrollInfo.scrollX,
        layers.whiteboardWindow.scrollTop + scrollInfo.scrollY
      );
    } else {
      layers.whiteboardWindow.scrollTo(scrollInfo.scrollX, scrollInfo.scrollY);
    }
  }

  private getZoomLevel(): ZoomLevel {
    if (!WhiteboardLayersService.zoomLevel) {
      WhiteboardLayersService.zoomLevel = new ZoomLevel();
    }
    return WhiteboardLayersService.zoomLevel;
  }
}
