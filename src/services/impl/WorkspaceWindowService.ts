import { ScrollInfo } from '../../models/ScrollInfo';
import { ZOOM_PERCENTAGE_STEP } from '../../models/app-state/ZoomLevel';
import { IWhiteboardWindowService } from '../IWhiteboardWindowService';
import { WHITEBOARD_MARGIN } from '../../constants/constants';
import { AppState } from '../../models/app-state/AppState';

export class WhiteboardWindowService implements IWhiteboardWindowService {
  private static instance: IWhiteboardWindowService = new WhiteboardWindowService();

  private constructor(private appState = AppState.getInstance()) {}

  static getInstance() {
    return WhiteboardWindowService.instance;
  }

  resize(): void {
    const whiteboardWindow = null; // this.appStateService.getWhiteboardWindow();
    const zoomLevel = this.appState.getZoomLevel();
    const whiteboardWindowBoundingRect = whiteboardWindow.whiteboardWindow.getBoundingClientRect();
    const whiteboardWidth = zoomLevel.getZoomedValueFromInitialValue(this.appState.getWhiteboardSize().width);
    const whiteboardHeight = zoomLevel.getZoomedValueFromInitialValue(this.appState.getWhiteboardSize().height);
    whiteboardWindow.whiteboard.style.width = `${whiteboardWidth}px`;
    whiteboardWindow.whiteboard.style.height = `${whiteboardHeight}px`;
    whiteboardWindow.whiteboard.style.left = `${whiteboardWindowBoundingRect.width - WHITEBOARD_MARGIN}px`;
    whiteboardWindow.whiteboard.style.top = `${whiteboardWindowBoundingRect.height - WHITEBOARD_MARGIN}px`;
    whiteboardWindow.whiteboardBackground.style.width = `${whiteboardWindowBoundingRect.width * 2 + whiteboardWidth - 2 * WHITEBOARD_MARGIN}px`;
    whiteboardWindow.whiteboardBackground.style.height = `${whiteboardWindowBoundingRect.height * 2 + whiteboardHeight - 2 * WHITEBOARD_MARGIN}px`;
  }

  centerOnStartUp(): void {
    const layers = null; // this.appState.getWhiteboardWindow();
    const whiteboardWindowBoundingRect = layers.whiteboardWindow.getBoundingClientRect();
    const whiteboardWidth = this.appState.getWhiteboardSize().width;
    const whiteboardHeight = this.appState.getWhiteboardSize().height;
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
  }

  centerOnZoomIn(event?: MouseEvent): void {
    const zoomLevel = this.appState.getZoomLevel();
    if (zoomLevel.currentPercentageZoom == zoomLevel.previousPercentageZoom) {
      return;
    }
    this.continueScrollToSouthEast(this.getWhiteboardZoomScroll(event));
  }

  centerOnZoomOut(event?: MouseEvent): void {
    const zoomLevel = this.appState.getZoomLevel();
    if (zoomLevel.currentPercentageZoom == zoomLevel.previousPercentageZoom) {
      return;
    }
    this.continueScrollToNorthWest(this.getWhiteboardZoomScroll(event));
  }

  private continueScrollToNorthWest(scrollInfo: ScrollInfo): void {
    const layers = null; // this.appState.getWhiteboardWindow();
    if (scrollInfo.continueScroll) {
      layers.whiteboardWindow.scrollTo(
        layers.whiteboardWindow.scrollLeft - scrollInfo.scrollX,
        layers.whiteboardWindow.scrollTop - scrollInfo.scrollY
      );
    } else {
      layers.whiteboardWindow.scrollTo(scrollInfo.scrollX, scrollInfo.scrollY);
    }
  }

  private continueScrollToSouthEast(scrollInfo: ScrollInfo): void {
    const layers = null; // this.appState.getWhiteboardWindow();
    if (scrollInfo.continueScroll) {
      layers.whiteboardWindow.scrollTo(
        layers.whiteboardWindow.scrollLeft + scrollInfo.scrollX,
        layers.whiteboardWindow.scrollTop + scrollInfo.scrollY
      );
    } else {
      layers.whiteboardWindow.scrollTo(scrollInfo.scrollX, scrollInfo.scrollY);
    }
  }

  private getMousePositionRelatedToWhiteboardContainer(event?: MouseEvent) {
    const layers = null; // this.appState.getWhiteboardWindow();
    if (event) {
      const whiteboardWindowBoundingRect = layers.whiteboardWindow.getBoundingClientRect();
      const whiteboardBackgroundBoundingRect = layers.whiteboardBackground.getBoundingClientRect();
      return {
        x: event.clientX - whiteboardBackgroundBoundingRect.x - (whiteboardWindowBoundingRect.width - WHITEBOARD_MARGIN),
        y: event.clientY - whiteboardBackgroundBoundingRect.y - (whiteboardWindowBoundingRect.height - WHITEBOARD_MARGIN),
      };
    } else {
      const whiteboardBoundingRect = layers.whiteboard.getBoundingClientRect();
      return {
        x: whiteboardBoundingRect.width / 2,
        y: whiteboardBoundingRect.height / 2,
      };
    }
  }

  private getWhiteboardZoomScroll(event?: MouseEvent): ScrollInfo {
    const zoomPercentage = this.appState.getZoomLevel().previousPercentageZoom;
    const mousePositionRelatedToWhiteboardContainer = this.getMousePositionRelatedToWhiteboardContainer(event);
    const scrollX = Math.floor((mousePositionRelatedToWhiteboardContainer.x * ZOOM_PERCENTAGE_STEP) / zoomPercentage);
    const scrollY = Math.floor((mousePositionRelatedToWhiteboardContainer.y * ZOOM_PERCENTAGE_STEP) / zoomPercentage);
    return {
      scrollX,
      scrollY,
      continueScroll: true,
    };
  }
}
