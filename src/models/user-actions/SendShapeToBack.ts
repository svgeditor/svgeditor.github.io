import { Shape } from '@svgdotjs/svg.js';
import { SvgElement } from '../SvgElement';
import { IUserAction } from './IUserAction';

export class SendShapeToBack implements IUserAction {
  constructor(public shape: SvgElement<Shape>) {}
}
