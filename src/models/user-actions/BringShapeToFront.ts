import { Shape } from '@svgdotjs/svg.js';
import { ShapeInfo } from '../ShapeInfo';
import { IUserAction } from './IUserAction';

export class BringShapeToFront implements IUserAction {
  constructor(public shape: ShapeInfo<Shape>) {}
}
