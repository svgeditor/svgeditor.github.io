import { SELECTION_BORDER_COLOR, STROKE_DASH_ARRAY, SVG_ELEMENT_GROUP_MOVE_HELPER_CSS_CLASS, SVG_NAMESPACE } from '../../constants/constants';
import { BoundingRectangle } from '../BoundingRectangle';
import { BaseSvgElement } from './BaseSvgElement';
import { ISvgElement } from './ISvgElement';

export class SvgMoveHelperElement extends BaseSvgElement implements ISvgElement {
  private element: SVGRectElement;
  public constructor(boundingRectangle: BoundingRectangle) {
    super();
    this.element = document.createElementNS(SVG_NAMESPACE, 'rect');
    this.boundingRectangle(boundingRectangle);
    this.borderColor(SELECTION_BORDER_COLOR);
    this.addCssClass(SVG_ELEMENT_GROUP_MOVE_HELPER_CSS_CLASS);
    this.backgroundColor('transparent');
    this.setAttribute('stroke-dasharray', STROKE_DASH_ARRAY);
  }

  clone(): SvgMoveHelperElement {
    return new SvgMoveHelperElement(this.getBoundingRectangle());
  }

  getElement() {
    return this.element;
  }

  boundingRectangle(boundingRectangle: BoundingRectangle): SvgMoveHelperElement {
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
