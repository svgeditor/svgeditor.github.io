import { WhiteboardLayers } from '../../models/WhiteboardLayers';
import { IAppStateService } from '../api/IAppStateService';
import { IWhiteboardGridService } from '../api/IWhiteboardGridService';
import { AppStateService } from './AppStateService';

const GRID_SIZE_INITIAL_VALUE = 10;

export class WhiteboardGridService implements IWhiteboardGridService {
  constructor(private appStateService: IAppStateService = AppStateService.getInstance()) {}

  init(whiteboardLayers: WhiteboardLayers): void {
    this.updateWhiteboardBackground(whiteboardLayers, this.getGridBase64(GRID_SIZE_INITIAL_VALUE));
  }

  resize(whiteboardLayers: WhiteboardLayers): void {
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const gridSize = zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE_INITIAL_VALUE);
    this.updateWhiteboardBackground(whiteboardLayers, this.getGridBase64(gridSize));
  }

  private updateWhiteboardBackground(whiteboardLayers: WhiteboardLayers, gridBase64: string) {
    const gridBackgroundCssValue = `url(data:image/svg+xml;base64,${gridBase64})`;
    whiteboardLayers.whiteboard.style.backgroundImage = gridBackgroundCssValue;
    whiteboardLayers.whiteboard.style.backgroundColor = 'white';
  }

  private getGridBase64(gridSize: number) {
    return btoa(/* html */ `
      <svg width="100%" height="100%"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
            <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="#00000022" stroke-width="0.5"/>
          </pattern>
          <pattern id="grid" width="${gridSize * 5}" height="${gridSize * 5}" patternUnits="userSpaceOnUse">
            <rect width="${gridSize * 5}" height="${gridSize * 5}" fill="url(#smallGrid)"/>
            <path d="M ${gridSize * 5} 0 L 0 0 0 ${gridSize * 5}" fill="none" stroke="#00000022" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
  `);
  }
}
