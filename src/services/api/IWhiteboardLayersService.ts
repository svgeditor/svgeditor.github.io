import { Position } from '../../models/Position';
import { ScrollInfo } from '../../models/ScrollInfo';
import { WhiteboardLayers } from '../../models/WhiteboardLayers';

export interface IWhiteboardLayersService {
  init(layers: WhiteboardLayers): void;
  zoomIn(): void;
  zoomIn(event: WheelEvent): void;
  zoomOut(): void;
  zoomOut(event: WheelEvent): void;
  getMousePositionRelatedToWhiteboardContainer(event: MouseEvent): Position;
  getMousePositionRelatedToWhiteboardContainer(): Position;
  getWhiteboardZoomScroll(zoomPercentage: number): ScrollInfo;
  getWhiteboardZoomScroll(zoomPercentage: number, event: MouseEvent): ScrollInfo;
  resize(): void;
  continueScrollNorthWest(scrollInfo: ScrollInfo): void;
  continueScrollSouthEast(scrollInfo: ScrollInfo): void;
}
