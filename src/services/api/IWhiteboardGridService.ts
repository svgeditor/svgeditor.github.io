import { WhiteboardLayers } from '../../models/WhiteboardLayers';

export interface IWhiteboardGridService {
  init(whiteboardLayers: WhiteboardLayers): void;
}
