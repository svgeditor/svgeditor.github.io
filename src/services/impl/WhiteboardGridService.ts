import { IAppStateService } from '../IAppStateService';
import { IWhiteboardGridService } from '../IWhiteboardGridService';
import { AppStateService } from './AppStateService';
import { GRID_SIZE } from '../../constants/constants';

export class WhiteboardGridService implements IWhiteboardGridService {
  private static instance: IWhiteboardGridService = new WhiteboardGridService();

  private constructor(private appStateService: IAppStateService = AppStateService.getInstance()) {}

  static getInstance(): IWhiteboardGridService {
    return WhiteboardGridService.instance;
  }

  init(): void {
    const whiteboardWindow = this.appStateService.getWhiteboardWindow();
    const zoomLevel = this.appStateService.getWhiteboardZoomLevel();
    const gridSize = zoomLevel.getZoomedValueFromInitialValue(GRID_SIZE);
    whiteboardWindow.whiteboardGrid.style.backgroundImage = `url(data:image/svg+xml;base64,${this.getGridBase64(gridSize)})`;
  }

  resize(): void {
    this.init();
  }

  add(): void {
    this.init();
  }

  remove(): void {
    const whiteboardWindow = this.appStateService.getWhiteboardWindow();
    whiteboardWindow.whiteboardGrid.style.backgroundImage = 'none';
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
