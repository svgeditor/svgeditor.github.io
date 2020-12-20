import { Shape, Svg } from '@svgdotjs/svg.js';
import { ISelectService } from './ISelectService';

export class SelectService implements ISelectService {
  // prettier-ignore
  selectElement(svg: Svg, rect: Shape): void {
    this.unselectElements(svg);
    let group = svg.findOne('g.selected-element-group');
    if (!group) {
      group = svg.group().addClass('selected-element-group');
    }
    const rectElement = svg.rect()
      .move(rect.x(), rect.y())
      .size(rect.width(), rect.height())
      .fill('transparent')
      .stroke({color: '#348CF7', dasharray: '5,5', width: 2});
    group.add(rectElement);
    group.front();
  }

  unselectElements(svg: Svg): void {
    let group = svg.findOne('g.selected-element-group');
    if (!group) {
      group = svg.group().addClass('selected-element-group');
    }
    group.each(function () {
      this.remove();
    });
  }

  getStyles(): string {
    return `
      /* <![CDATA[ */

      .selected-element-group {
        pointer-events: none;
      }

      /* ]]> */
    `;
  }
}
