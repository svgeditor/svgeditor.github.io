import { Shape, Svg } from '@svgdotjs/svg.js';
import {
  MOVE_IN_PROGRESS_CLASS_NAME,
  RESIZE_GUIDE_CLASS_NAME,
  SELECTABLE_BORDER_CLASS_NAME,
  SELECTABLE_BORDER_GROUP_CLASS_NAME,
  SHAPE_DATA,
} from './_constants';
import { ISelectService } from '../api/ISelectService';

export class SelectService implements ISelectService {
  private group = null;
  // prettier-ignore
  selectElement(svg: Svg, shape: Shape): void {
    this.unselectElements(svg);
    this.setGroup(svg);
    this.group.add(this.createBorder(svg, shape));
    this.group.add(this.createResizeGuideNW(svg, shape));
    this.group.add(this.createResizeGuideN(svg, shape));
    this.group.add(this.createResizeGuideNE(svg, shape));
    this.group.add(this.createResizeGuideE(svg, shape));
    this.group.add(this.createResizeGuideSE(svg, shape));
    this.group.add(this.createResizeGuideS(svg, shape));
    this.group.add(this.createResizeGuideSW(svg, shape));
    this.group.add(this.createResizeGuideW(svg, shape));
    this.group.front();
  }

  unselectElements(svg: Svg): void {
    this.setGroup(svg);
    this.group.each(function () {
      this.remove();
    });
  }

  getStyles(): string {
    return `
      /* <![CDATA[ */
        .${SELECTABLE_BORDER_GROUP_CLASS_NAME} .${SELECTABLE_BORDER_CLASS_NAME} {
          pointer-events: none;
        }

        .${MOVE_IN_PROGRESS_CLASS_NAME} .${RESIZE_GUIDE_CLASS_NAME} {
          opacity: 0;
        }

        .${MOVE_IN_PROGRESS_CLASS_NAME} .${SELECTABLE_BORDER_CLASS_NAME} {
          opacity: 0.75;
        }
      /* ]]> */
    `;
  }

  private setGroup(svg: Svg): void {
    if (!this.group) {
      this.group = svg.findOne(`g.${SELECTABLE_BORDER_GROUP_CLASS_NAME}`);
      if (!this.group) this.group = svg.group().addClass(`${SELECTABLE_BORDER_GROUP_CLASS_NAME}`);
    }
  }

  private createBorder(svg: Svg, shape: Shape): Shape {
    return svg
      .rect()
      .addClass(SELECTABLE_BORDER_CLASS_NAME)
      .move(shape.x(), shape.y())
      .size(shape.width(), shape.height())
      .fill('transparent')
      .stroke({ color: '#348CF7', dasharray: '5,5', width: 2 })
      .data(SHAPE_DATA, shape.id());
  }

  private createResizeGuideNW(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x(), shape.y());
    circle.addClass(RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    return circle;
  }

  private createResizeGuideN(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x() + shape.width() / 2, shape.y());
    circle.addClass(RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ns-resize');
    return circle;
  }

  private createResizeGuideNE(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x() + shape.width(), shape.y());
    circle.addClass(RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nesw-resize');
    return circle;
  }

  private createResizeGuideE(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x() + shape.width(), shape.y() + shape.height() / 2);
    circle.addClass(RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ew-resize');
    return circle;
  }

  private createResizeGuideSE(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x() + shape.width(), shape.y() + shape.height());
    circle.addClass(RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nwse-resize');
    return circle;
  }

  private createResizeGuideS(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x() + shape.width() / 2, shape.y() + shape.height());
    circle.addClass(RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ns-resize');
    return circle;
  }

  private createResizeGuideSW(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x(), shape.y() + shape.height());
    circle.addClass(RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'nesw-resize');
    return circle;
  }

  private createResizeGuideW(svg: Svg, shape: Shape): Shape {
    const circle = this.createResizeGuide(svg, shape.x(), shape.y() + shape.height() / 2);
    circle.addClass(RESIZE_GUIDE_CLASS_NAME);
    circle.css('cursor', 'ew-resize');
    return circle;
  }

  // prettier-ignore
  private createResizeGuide(svg: Svg, x: number, y: number): Shape {
    return svg
      .circle(10)
      .cx(x).cy(y)
      .fill('#348CF7')
      .stroke({ color: 'white', width: 1.5 });
  }
}
