import { ZoomLevel } from '../../models/ZoomLevel';

export interface IWhiteboardZoomService {
  getZoomLevel(): ZoomLevel;
  handleZoomEvent(event: WheelEvent): void;
  zoomIn(event: WheelEvent): void;
  zoomOut(event: WheelEvent): void;
}
