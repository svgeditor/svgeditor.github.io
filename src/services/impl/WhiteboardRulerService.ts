import { WhiteboardLayers } from '../../models/WhiteboardLayers';
import { IWhiteboardRulerService } from '../api/IWhiteboardRulerService';
import { AppStateService } from './AppStateService';
import { GRID_SIZE, RULER_COLOR, RULER_WIDTH, WHITEBOARD_MARGIN } from './_constants';

export class WhiteboardRulerService implements IWhiteboardRulerService {
  constructor(private appStateService = AppStateService.getInstance()) {}

  init(layers: WhiteboardLayers) {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const whiteboardWindowBoundingRect = layers.whiteboardWindow.getBoundingClientRect();
    const whiteboardHeight = this.appStateService.getWhiteboardHeight();
    layers.whiteboardHorizontalRuler.style.margin = `0 ${whiteboardWindowBoundingRect.width - WHITEBOARD_MARGIN}px`;
    layers.whiteboardHorizontalRuler.style.height = `100%`;
    const innerHorizontalRuler = document.createElement('div');
    innerHorizontalRuler.style.background = `url(data:image/svg+xml;base64,${this.getHorizontalRulerBase64()})`;
    innerHorizontalRuler.style.height = '100%';
    layers.whiteboardHorizontalRuler.innerHTML = '';
    layers.whiteboardHorizontalRuler.appendChild(innerHorizontalRuler);

    layers.whiteboardVerticalRuler.style.margin = `${whiteboardWindowBoundingRect.height - WHITEBOARD_MARGIN}px 0`;
    layers.whiteboardVerticalRuler.style.height = `${zoomLevel.getZoomedValueFromInitialValue(whiteboardHeight)}px`;
    const innerVerticalRuler = document.createElement('div');
    innerVerticalRuler.style.background = `url(data:image/svg+xml;base64,${this.getVerticalRulerBase64()})`;
    innerVerticalRuler.style.height = '100%';
    layers.whiteboardVerticalRuler.innerHTML = '';
    layers.whiteboardVerticalRuler.appendChild(innerVerticalRuler);
  }

  resize(layers: WhiteboardLayers) {
    this.init(layers);
  }

  private getHorizontalRulerBase64(): string {
    let svg = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const ruleLinesNb = Math.floor(this.appStateService.getWhiteboardWidth() / 10);
    for (let i = 0; i <= ruleLinesNb; i++) {
      if (i % 5 == 0) {
        if (i % 10 == 0) {
          svg += `<path d="M ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} 9 V ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
          svg += `<text x="${
            i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE) - this.getRulerTextMargin(i * GRID_SIZE)
          }" y="7" font-size="8" font-family="sans-serif" fill="${RULER_COLOR}">${i * GRID_SIZE}</text>`;
        } else {
          svg += `<path d="M ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} 7 V ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
        }
      } else {
        svg += `<path d="M ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} 12 V ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
      }
    }
    svg += '</svg>';
    return btoa(svg);
  }

  private getVerticalRulerBase64(): string {
    let svg = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">';
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const ruleLinesNb = Math.floor(this.appStateService.getWhiteboardHeight() / 10);
    for (let i = 0; i <= ruleLinesNb; i++) {
      if (i % 5 == 0) {
        if (i % 10 == 0) {
          svg += `<path d="M 9 ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} H ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
          svg += `<text x="-${
            i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE) + this.getRulerTextMargin(i * GRID_SIZE)
          }" y="7" font-size="8" font-family="sans-serif" fill="${RULER_COLOR}" transform="rotate(-90)">${i * GRID_SIZE}</text>`;
        } else {
          svg += `<path d="M 7 ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} H ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
        }
      } else {
        svg += `<path d="M 12 ${i * zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE)} H ${RULER_WIDTH}" stroke="${RULER_COLOR}"/>`;
      }
    }
    svg += '</svg>';
    return btoa(svg);
  }

  private getRulerTextMargin(nb: number): number {
    return nb.toString().length * 3 - 1;
  }
}
