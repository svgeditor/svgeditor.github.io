import { HOVER_HELPER_SVG_ELEMENT_CSS_CLASS } from '../../constants/constants';
import { RandomIdGenerator } from '../../services/impl/RandomIdGenerator';
import { BoundingRectangle } from '../BoundingRectangle';
import { ISvgElement } from './ISvgElement';

export abstract class BaseSvgElement implements ISvgElement {
  constructor(private randomIdGenerator = RandomIdGenerator.getInstance()) {}

  id(id: string): ISvgElement {
    this.getElement().id = id;
    return this;
  }

  getId(): string {
    return this.getElement().id;
  }

  addClass(className: string): ISvgElement {
    this.getElement().classList.add(className);
    return this;
  }

  removeClass(className: string): ISvgElement {
    this.getElement().classList.remove(className);
    return this;
  }

  fill(color: string): ISvgElement {
    this.getElement().setAttribute('fill', color);
    return this;
  }

  strokeColor(stroke: string): ISvgElement {
    this.getElement().setAttribute('stroke', stroke);
    return this;
  }

  strokeWidth(width: number): ISvgElement {
    this.getElement().setAttribute('stroke-width', width + '');
    return this;
  }

  removeAllClasses(): ISvgElement {
    this.getElement().removeAttribute('class');
    return this;
  }

  getHoverHelper(): ISvgElement {
    return this.clone()
      .id(this.randomIdGenerator.generate())
      .removeAllClasses()
      .addClass(HOVER_HELPER_SVG_ELEMENT_CSS_CLASS)
      .strokeColor('#348CF7')
      .fill('transparent');
  }

  isEmpty(): boolean {
    return !this.getElement().getAttribute('width') || !this.getElement().getAttribute('height');
  }

  abstract getElement(): SVGElement;
  abstract clone(): ISvgElement;
  abstract getBoundingRectangle(): BoundingRectangle;
}
