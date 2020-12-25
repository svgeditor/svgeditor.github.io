import { Position } from '../../models/Position';
import { ScrollInfo } from '../../models/ScrollInfo';
import { WhiteboardLayers } from '../../models/WhiteboardLayers';

export interface IWhiteboardLayersService {
  init(layers: WhiteboardLayers): void;
  zoomIn(event: WheelEvent): void;
  zoomOut(event: WheelEvent): void;
  getMousePositionRelatedToWhiteboardContainer(event: MouseEvent): Position;
  getWhiteboardZoomScroll(event: MouseEvent, zoomPercentage: number): ScrollInfo;
  resize(): void;
  continueScrollNorthWest(scrollInfo: ScrollInfo): void;
  continueScrollSouthEast(scrollInfo: ScrollInfo): void;
}
