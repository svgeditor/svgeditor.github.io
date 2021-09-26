import { AppState } from '../app-state/AppState';
import { Position } from '../Position';
import { SvgRectangle } from './SvgRectangle';
import { BoundingRectangle } from '../BoundingRectangle';
import { ISvgElement } from './ISvgElement';
import { SVG_ELEMENT_CSS_CLASS } from '../../constants/constants';
import { RandomIdGenerator } from '../../services/impl/RandomIdGenerator';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export class SvgRootElement {
  private constructor(
    private svg: SVGSVGElement,
    private appState = AppState.getInstance(),
    private randomIdGenerator = RandomIdGenerator.getInstance()
  ) {}

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
    this.svg.appendChild(svgElement.getElement());
    return this;
  }

  remove(svgElement: ISvgElement): SvgRootElement {
    this.svg.removeChild(svgElement.getElement());
    return this;
  }

  rect(position: Position): SvgRectangle {
    const element = document.createElementNS(SVG_NAMESPACE, 'rect');
    this.svg.appendChild(element);
    const res = SvgRectangle.from(element);
    res.move(position);
    res.id(this.randomIdGenerator.generate());
    res.fill(this.appState.getNewSvgRectangleProps().fill);
    res.strokeColor(this.appState.getNewSvgRectangleProps().strokeColor);
    res.strokeWidth(this.appState.getNewSvgRectangleProps().strokeWidth);
    res.addClass(SVG_ELEMENT_CSS_CLASS);
    return res;
  }

  getBoundingRectangle(): BoundingRectangle {
    return BoundingRectangle.fromSvgElement(this.svg);
  }
}
