import { AppState } from '../app-state/AppState';
import { Position } from '../Position';
import { SvgRectangle } from './SvgRectangle';
import { BoundingRectangle } from '../BoundingRectangle';
import { ISvgElement } from './ISvgElement';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SVG_ELEMENT_CLASS_NAME = 'svg-element';

export class SvgRootElement {
  private constructor(private svg: SVGSVGElement, private appState = AppState.getInstance()) {}

  static from(svg: SVGSVGElement): SvgRootElement {
    return new SvgRootElement(svg);
  }

  addClass(className: string): SvgRootElement {
    this.svg.classList.add(className);
    return this;
  }

  removeClass(className: string): SvgRootElement {
    this.svg.classList.remove(className);
    return this;
  }

  add(svgElement: ISvgElement): SvgRootElement {
    this.svg.appendChild(svgElement.getSvgElement());
    return this;
  }

  rect(position: Position): SvgRectangle {
    const element = document.createElementNS(SVG_NAMESPACE, 'rect');
    const res = SvgRectangle.from(element);
    res.move(position);
    res.fill(this.appState.getNewSvgRectangleProps().fill);
    res.strokeColor(this.appState.getNewSvgRectangleProps().strokeColor);
    res.strokeWidth(this.appState.getNewSvgRectangleProps().strokeWidth);
    res.addClass(SVG_ELEMENT_CLASS_NAME);
    this.svg.appendChild(element);
    return res;
  }

  getBoundingRectangle(): BoundingRectangle {
    return BoundingRectangle.fromSvgElement(this.svg);
  }
}
