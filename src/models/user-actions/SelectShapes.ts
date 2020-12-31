import { Shape } from '@svgdotjs/svg.js';
import { SvgShape } from '../SvgShape';
import { IUserAction } from './IUserAction';

export class SelectShapes implements IUserAction {
  constructor(public shapes: SvgShape<Shape>[]) {}
}
