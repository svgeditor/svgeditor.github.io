import { SVG_ELEMENT_HOVER_HELPER_CSS_CLASS } from '../../constants/constants';
import { RandomIdGenerator } from '../../services/impl/RandomIdGenerator';
import { BoundingRectangle } from '../BoundingRectangle';
import { ISvgElement } from './ISvgElement';

export abstract class BaseSvgElement implements ISvgElement {
  constructor(protected randomIdGenerator = RandomIdGenerator.getInstance()) {}

  id(id: string): ISvgElement {
    this.getElement().id = id;
    return this;
  }

  getId(): string {
    return this.getElement().id;
  }

  addCssClass(className: string): ISvgElement {
    this.getElement().classList.add(className);
    return this;
  }

  removeCssClass(className: string): ISvgElement {
    this.getElement().classList.remove(className);
    return this;
  }

  backgroundColor(color: string): ISvgElement {
    this.getElement().setAttribute('fill', color);
    return this;
  }

  borderColor(stroke: string): ISvgElement {
    this.getElement().setAttribute('stroke', stroke);
    return this;
  }

  borderWidth(width: number): ISvgElement {
    this.getElement().setAttribute('stroke-width', width + '');
    return this;
  }

  removeAllCssClasses(): ISvgElement {
    this.getElement().removeAttribute('class');
    return this;
  }

  getHoverHelper(): ISvgElement {
    return this.clone()
      .id(this.randomIdGenerator.generate())
      .removeAllCssClasses()
      .addCssClass(SVG_ELEMENT_HOVER_HELPER_CSS_CLASS)
      .borderColor('#348CF7')
      .backgroundColor('transparent');
  }

  isNone(): boolean {
    return !this.getElement().getAttribute('width') || !this.getElement().getAttribute('height');
  }

  add<T extends ISvgElement>(svgElement: T): T {
    this.getElement().appendChild(svgElement.getElement());
    return svgElement;
  }

  abstract getElement(): SVGElement;
  abstract clone(): ISvgElement;
  abstract getBoundingRectangle(): BoundingRectangle;
}
