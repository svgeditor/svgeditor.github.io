import { G, Rect, Svg } from '@svgdotjs/svg.js';
import { IRectangleElementService } from './IRectangleElementService';

interface Position {
  x: number;
  y: number;
}

export class RectangleElementService implements IRectangleElementService {
  private rectContainer: G;
  private rectElement: Rect;
  private rectInitialPosition: Position;

  constructor() {
    this.resize = this.resize.bind(this);
    this.endResize = this.endResize.bind(this);
  }

  // prettier-ignore
  create(svg: Svg, event: MouseEvent): void {
    this.rectContainer = svg.group();
    this.rectElement = svg.rect();
    this.rectInitialPosition = { x: event.offsetX, y: event.offsetY };
    this.rectContainer.add(this.rectElement);
    this.rectElement
      .move(event.offsetX, event.offsetY)
      .size(0, 0)
      .fill('white')
      .stroke({color: '#222', width: 1});
    document.addEventListener('mousemove', this.resize);
    document.addEventListener('mouseup', this.endResize);
  }

  getStyles(): string {
    return `
      /* <![CDATA[ */
      .resize-guide {
        fill: #369bfa;
        stroke: white;
        stroke-width: 2;
        opacity: 0;
        transition: all 0.15s ease-in-out;
        transition-property: opacity;
        transition-duration: 350ms;
      }
      .resizable:hover .resize-guide {
        opacity: 1;
      }
      /* ]]> */
    `;
  }

  private resize(event: MouseEvent): void {
    event.preventDefault();
    const x = Math.min(event.offsetX, this.rectInitialPosition.x);
    const y = Math.min(event.offsetY, this.rectInitialPosition.y);
    const width = Math.abs(event.offsetX - this.rectInitialPosition.x);
    const height = Math.abs(event.offsetY - this.rectInitialPosition.y);
    this.rectElement.move(x, y).size(width, height);
  }

  private endResize() {
    if (this.rectElement.width() == 0 || this.rectElement.height() == 0) {
      this.rectContainer.remove();
    }
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.endResize);
  }
}
