import { WhiteboardLayers } from '../../models/WhiteboardLayers';
import { IWhiteboardGridService } from '../api/IWhiteboardGridService';

export class WhiteboardGridService implements IWhiteboardGridService {
  init(whiteboardLayers: WhiteboardLayers): void {
    const gridBackgroundCssValue = `url(data:image/svg+xml;base64,${this.getGridBase64()})`;
    whiteboardLayers.whiteboard.style.backgroundImage = gridBackgroundCssValue;
    whiteboardLayers.whiteboard.style.backgroundColor = 'white';
  }

  private getGridBase64() {
    const gridSize = 10;
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
