import { Shape } from '@svgdotjs/svg.js';
import { SvgShape } from '../../deprecated/SvgShape';
import { IUserAction } from './IUserAction';

export class SendShapesToBack implements IUserAction {
  constructor(public shapes: SvgShape<Shape>[]) {}
}
