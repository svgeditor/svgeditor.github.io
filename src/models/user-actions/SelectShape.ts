import { Shape } from '@svgdotjs/svg.js';
import { SvgElement } from '../SvgElement';
import { IUserAction } from './IUserAction';

export class SelectShape implements IUserAction {
  constructor(public shape: SvgElement<Shape>) {}
}
