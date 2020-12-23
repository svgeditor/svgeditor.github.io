import { Dimensions } from './Dimensions';
import { ZoomPercentage } from './ZoomPercentage';

export class AppState {
  zoomPercentage = new ZoomPercentage();
  svgDimensions: Dimensions = {
    width: 850,
    height: 400,
  };
}
