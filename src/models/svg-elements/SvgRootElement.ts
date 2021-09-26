import { AppState } from '../app-state/AppState';
import { ISvgElement } from '../svg-elements/ISvgElement';
import { Position } from '../Position';
import { SvgRectangle } from './SvgRectangle';
import { BoundingRectangle } from '../BoundingRectangle';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export class SvgRootElement {
  private constructor(private svg: SVGSVGElement, private appState = AppState.getInstance()) {}

  static from(svg: SVGSVGElement): SvgRootElement {
    return new SvgRootElement(svg);
  }

  rect(position: Position): SvgRectangle {
    const element = document.createElementNS(SVG_NAMESPACE, 'rect');
    element.setAttribute('x', position.x + '');
    element.setAttribute('y', position.y + '');
    element.setAttribute('fill', this.appState.getNewSvgRectangleProps().fill);
    element.setAttribute('stroke', this.appState.getNewSvgRectangleProps().strokeColor);
    element.setAttribute('stroke-width', this.appState.getNewSvgRectangleProps().strokeWidth + '');
    this.svg.appendChild(element);
    return SvgRectangle.from(element);
  }

  getBoundingRectangle(): BoundingRectangle {
    return BoundingRectangle.fromSvgElement(this.svg);
  }
}
