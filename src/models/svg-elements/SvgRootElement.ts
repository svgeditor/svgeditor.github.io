import { BoundingRectangle } from '../BoundingRectangle';
import { ISvgElement } from './ISvgElement';
import { RandomIdGenerator } from '../../services/impl/RandomIdGenerator';
import { SvgGroup } from './SvgGroup';
import { SVG_NAMESPACE, SVG_ELEMENT_GROUP_CSS_CLASS } from '../../constants/constants';

export class SvgRootElement {
  private constructor(private svg: SVGSVGElement, private randomIdGenerator = RandomIdGenerator.getInstance()) {}

  static from(svg: SVGSVGElement): SvgRootElement {
    return new SvgRootElement(svg);
  }

  addCssClass(className: string): SvgRootElement {
    this.svg.classList.add(className);
    return this;
  }

  removeCssClass(className: string): SvgRootElement {
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

  group(): SvgGroup {
    const element = document.createElementNS(SVG_NAMESPACE, 'g');
    this.svg.appendChild(element);
    const res = SvgGroup.from(element);
    res.id(this.randomIdGenerator.generate());
    res.addCssClass(SVG_ELEMENT_GROUP_CSS_CLASS);
    return res;
  }

  getBoundingRectangle(): BoundingRectangle {
    return BoundingRectangle.fromSvgElement(this.svg);
  }
}
