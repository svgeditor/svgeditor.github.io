import { Shape } from '@svgdotjs/svg.js';
import { SvgShape } from '../SvgShape';
import { IUserAction } from './IUserAction';

export class SelectShape implements IUserAction {
  constructor(public shape: SvgShape<Shape>) {}
}
