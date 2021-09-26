import { ZoomLevel } from './app-state/ZoomLevel';

export class Position {
  constructor(public x: number, public y: number) {}

  zoom(zoomLevel: ZoomLevel): Position {
    return new Position(zoomLevel.getZoomedValue(this.x), zoomLevel.getZoomedValue(this.y));
  }

  unZoom(zoomLevel: ZoomLevel): Position {
    return new Position(zoomLevel.getInitialValue(this.x), zoomLevel.getInitialValue(this.y));
  }
}
