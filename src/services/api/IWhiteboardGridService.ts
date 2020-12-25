import { WhiteboardLayers } from '../../models/WhiteboardLayers';
import { ZoomLevel } from '../../models/ZoomLevel';

export interface IWhiteboardGridService {
  init(whiteboardLayers: WhiteboardLayers): void;
  resize(whiteboardLayers: WhiteboardLayers): void;
}
