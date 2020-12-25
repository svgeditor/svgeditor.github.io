import { WhiteboardLayers } from '../../models/WhiteboardLayers';

export interface IWhiteboardGridService {
  init(whiteboardLayers: WhiteboardLayers): void;
  resize(whiteboardLayers: WhiteboardLayers): void;
}
