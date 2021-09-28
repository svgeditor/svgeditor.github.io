import { SVG_ELEMENT_HOVER_HELPER_CSS_CLASS, SVG_NAMESPACE } from '../../constants/constants';
import { BoundingRectangle } from '../BoundingRectangle';
import { BaseSvgElement } from './BaseSvgElement';
import { ISvgElement } from './ISvgElement';

export class SvgHoverHelperElement extends BaseSvgElement implements ISvgElement {
  private element: SVGRectElement;
  public constructor(boundingRectangle: BoundingRectangle) {
    super();
    this.element = document.createElementNS(SVG_NAMESPACE, 'rect');
    this.boundingRectangle(boundingRectangle);
    this.addCssClass(SVG_ELEMENT_HOVER_HELPER_CSS_CLASS);
    this.borderColor('#348CF7');
    this.backgroundColor('transparent');
  }

  clone(): SvgHoverHelperElement {
    return new SvgHoverHelperElement(this.getBoundingRectangle());
  }

  getElement() {
    return this.element;
  }

  boundingRectangle(boundingRectangle: BoundingRectangle): SvgHoverHelperElement {
    this.element.setAttribute('x', boundingRectangle.x + '');
    this.element.setAttribute('y', boundingRectangle.y + '');
    this.element.setAttribute('width', boundingRectangle.width + '');
    this.element.setAttribute('height', boundingRectangle.height + '');
    return this;
  }

  getBoundingRectangle(): BoundingRectangle {
    const x = parseInt(this.element.getAttribute('x'));
    const y = parseInt(this.element.getAttribute('y'));
    const width = parseInt(this.element.getAttribute('width'));
    const height = parseInt(this.element.getAttribute('height'));
    return new BoundingRectangle(x, y, width, height);
  }
}
