import { SvgGroup } from '../models/svg-elements/SvgGroup';

export interface IMoveSvgElementService {
  moveOnMouseDown(event: MouseEvent, svgGroup: SvgGroup): void;
}
