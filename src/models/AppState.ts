import { G, Svg } from '@svgdotjs/svg.js';
import { Dimensions } from './Dimensions';
import { ZoomLevel } from './ZoomLevel';

export class AppState {
  whiteboardDimensions: Dimensions = {
    width: 800,
    height: 1000,
  };
  whiteboardZoomLevel: ZoomLevel = new ZoomLevel();
  whiteboardSvgRootElement: Svg;
  selectedShapeGroup: G = null;
}
