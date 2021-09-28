import { G } from '@svgdotjs/svg.js';
import {
  SELECTION_BORDER_COLOR,
  STROKE_DASH_ARRAY,
  SVG_ELEMENT_CSS_CLASS,
  SVG_ELEMENT_GROUP_MOVE_HELPER_CSS_CLASS,
  SVG_NAMESPACE,
} from '../../constants/constants';
import { AppState } from '../app-state/AppState';
import { BoundingRectangle } from '../BoundingRectangle';
import { Position } from '../Position';
import { BaseSvgElement } from './BaseSvgElement';
import { ISvgElement } from './ISvgElement';
import { SvgRectangle } from './SvgRectangle';

export class SvgGroup extends BaseSvgElement implements ISvgElement {
  private g: G;
  private constructor(private element: SVGGElement, private appState = AppState.getInstance()) {
    super();
    this.g = new G(this.element);
  }

  static from(element: SVGGElement) {
    return new SvgGroup(element);
  }

  clone(): SvgGroup {
    const element = this.getElement().cloneNode() as SVGRectElement;
    return new SvgGroup(element);
  }

  getElement() {
    return this.element;
  }

  boundingRectangle(boundingRectangle: BoundingRectangle): SvgGroup {
    this.element.setAttribute('x', boundingRectangle.x + '');
    this.element.setAttribute('y', boundingRectangle.y + '');
    this.element.setAttribute('width', boundingRectangle.width + '');
    this.element.setAttribute('height', boundingRectangle.height + '');
    return this;
  }

  getBoundingRectangle(): BoundingRectangle {
    return new BoundingRectangle(this.x(), this.y(), this.width(), this.height());
  }

  rect(position: Position): SvgRectangle {
    const element = document.createElementNS(SVG_NAMESPACE, 'rect');
    this.element.appendChild(element);
    const res = SvgRectangle.from(element);
    res.move(position);
    res.backgroundColor(this.appState.getNewSvgRectangleProps().backgroundColor);
    res.borderColor(this.appState.getNewSvgRectangleProps().borderColor);
    res.borderWidth(this.appState.getNewSvgRectangleProps().borderWidth);
    res.addCssClass(SVG_ELEMENT_CSS_CLASS);
    return res;
  }

  move(x: number, y: number): SvgGroup {
    this.g.move(x, y);
    return this;
  }

  x(): number {
    return this.g.x();
  }

  y(): number {
    return this.g.y();
  }

  width(): number {
    return this.g.width();
  }

  height(): number {
    return this.g.height();
  }
}
