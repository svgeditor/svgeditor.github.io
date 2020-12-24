import { Position } from '../../models/Position';
import { ScrollInfo } from '../../models/ScrollInfo';
import { WhiteboardLayers } from '../../models/WhiteboardLayers';
import { ZoomLevel } from '../../models/ZoomLevel';

export interface IWhiteboardLayersService {
  init(layers: WhiteboardLayers): void;
  getMousePositionRelatedToWhiteboardContainer(event: MouseEvent): Position;
  getWhiteboardZoomScroll(event: MouseEvent, zoomPercentage: number): ScrollInfo;
  resize(zoomLevel: ZoomLevel): void;
  continueScrollNorthWest(scrollInfo: ScrollInfo): void;
  continueScrollSouthEast(scrollInfo: ScrollInfo): void;
}
