import { Shape } from '@svgdotjs/svg.js';
import { SvgShape } from '../SvgShape';
import { IUserAction } from './IUserAction';

export class BringShapesToFront implements IUserAction {
  constructor(public shapes: SvgShape<Shape>[]) {}
}
