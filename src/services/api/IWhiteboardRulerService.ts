import { WhiteboardLayers } from '../../models/WhiteboardLayers';

export interface IWhiteboardRulerService {
  init(layers: WhiteboardLayers);
  resize(layers: WhiteboardLayers);
}
