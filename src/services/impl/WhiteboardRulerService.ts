import { IWhiteboardRulerService } from '../IWhiteboardRulerService';
import { GRID_SIZE, RULER_COLOR, RULER_WIDTH, WHITEBOARD_MARGIN } from '../../constants/constants';
import { AppState } from '../../models/app-state/AppState';

export class WhiteboardRulerService implements IWhiteboardRulerService {
  private static instance: IWhiteboardRulerService = new WhiteboardRulerService();

  private constructor(private appState = AppState.getInstance()) {}

  static getInstance(): IWhiteboardRulerService {
    return WhiteboardRulerService.instance;
  }

  resize() {
    const whiteboardWindow = null; // this.appState.getWhiteboardWindow();
    const zoomLevel = this.appState.getZoomLevel();
    const whiteboardWindowBoundingRect = whiteboardWindow.whiteboardWindow.getBoundingClientRect();
    const whiteboardHeight = this.appState.getWhiteboardSize().height;
    whiteboardWindow.whiteboardHorizontalRuler.style.margin = `0 ${whiteboardWindowBoundingRect.width - WHITEBOARD_MARGIN}px`;
    whiteboardWindow.whiteboardHorizontalRuler.style.height = `100%`;
    const innerHorizontalRuler = document.createElement('div');
    innerHorizontalRuler.style.background = `url(data:image/svg+xml;base64,${this.getHorizontalRulerBase64()})`;
    innerHorizontalRuler.style.height = '100%';
    whiteboardWindow.whiteboardHorizontalRuler.innerHTML = '';
    whiteboardWindow.whiteboardHorizontalRuler.appendChild(innerHorizontalRuler);

    whiteboardWindow.whiteboardVerticalRuler.style.margin = `${whiteboardWindowBoundingRect.height - WHITEBOARD_MARGIN}px 0`;
    whiteboardWindow.whiteboardVerticalRuler.style.height = `${zoomLevel.getZoomedValueFromInitialValue(whiteboardHeight)}px`;
    const innerVerticalRuler = document.createElement('div');
    innerVerticalRuler.style.background = `url(data:image/svg+xml;base64,${this.getVerticalRulerBase64()})`;
    innerVerticalRuler.style.height = '100%';
    whiteboardWindow.whiteboardVerticalRuler.innerHTML = '';
    whiteboardWindow.whiteboardVerticalRuler.appendChild(innerVerticalRuler);
  }

  private getHorizontalRulerBase64(): string {
    let svg = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
    const zoomLevel = this.appState.getZoomLevel();
    const whiteboardWidth = this.appState.getWhiteboardSize().width;
    const ruleLinesNb = Math.floor(whiteboardWidth / 10);
    for (let i = 0; i <= ruleLinesNb; i++) {
      if (i % 5 == 0) {
        if (i % 10 == 0) {
          svg += `<path d="M ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} 12 V ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
          svg += `<text x="${
            i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE) - this.getRulerTextMargin(i * GRID_SIZE)
          }" y="10" font-size="9" font-family="sans-serif" fill="${RULER_COLOR}">${i * GRID_SIZE}</text>`;
        } else {
          svg += `<path d="M ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} 10 V ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
        }
      } else {
        svg += `<path d="M ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} 15 V ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
      }
    }
    svg += `<path d="M 0 ${RULER_WIDTH} H ${zoomLevel.getZoomedValueFromInitialValue(whiteboardWidth)}" stroke="${RULER_COLOR}"/>`;
    svg += '</svg>';
    return btoa(svg);
  }

  private getVerticalRulerBase64(): string {
    let svg = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
    const zoomLevel = this.appState.getZoomLevel();
    const whiteboardHeight = this.appState.getWhiteboardSize().height;
    const ruleLinesNb = Math.floor(whiteboardHeight / 10);
    for (let i = 0; i <= ruleLinesNb; i++) {
      if (i % 5 == 0) {
        if (i % 10 == 0) {
          svg += `<path d="M 12 ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} H ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
          svg += `<text x="-${
            i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE) + this.getRulerTextMargin(i * GRID_SIZE)
          }" y="10" font-size="9" font-family="sans-serif" fill="${RULER_COLOR}" transform="rotate(-90)">${i * GRID_SIZE}</text>`;
        } else {
          svg += `<path d="M 10 ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} H ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
        }
      } else {
        svg += `<path d="M 15 ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} H ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
      }
    }
    svg += `<path d="M ${RULER_WIDTH} 0 V ${zoomLevel.getZoomedValueFromInitialValue(whiteboardHeight)}" stroke="${RULER_COLOR}"/>`;
    svg += '</svg>';
    return btoa(svg);
  }

  private getRulerTextMargin(nb: number): number {
    return nb.toString().length * 3 - 1;
  }
}
