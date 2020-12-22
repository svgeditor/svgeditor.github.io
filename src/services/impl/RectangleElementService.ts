import { G, Rect, Svg } from '@svgdotjs/svg.js';
import {
  MOVEABLE_CLASS_NAME,
  ON_HOVER_HELPER_CLASS_NAME,
  RESIZABLE_CLASS_NAME,
  SELECTABLE_CLASS_NAME,
  SELECTABLE_GROUP_CLASS_NAME,
  SELECTION_COLOR,
} from './_constants';
import { IRectangleElementService } from '../api/IRectangleElementService';

interface Position {
  x: number;
  y: number;
}

export class RectangleElementService implements IRectangleElementService {
  private container: G;
  private element: Rect;
  private initialPosition: Position;

  constructor() {
    this.resize = this.resize.bind(this);
    this.endResize = this.endResize.bind(this);
  }

  // prettier-ignore
  create(event: MouseEvent, svg: Svg): void {
    this.container = svg.group().addClass(SELECTABLE_GROUP_CLASS_NAME);
    this.element = svg.rect();
    this.initialPosition = { x: event.offsetX, y: event.offsetY };
    this.container.add(this.element);
    this.element
      .addClass(RESIZABLE_CLASS_NAME)
      .addClass(MOVEABLE_CLASS_NAME)
      .addClass(SELECTABLE_CLASS_NAME)
      .move(event.offsetX, event.offsetY)
      .size(0, 0)
      .fill('white')
      .stroke({color: '#707070', width: 1});
    document.addEventListener('mousemove', this.resize);
    document.addEventListener('mouseup', this.endResize);
  }

  getStyles(): string {
    return `
      /* <![CDATA[ */
        .${ON_HOVER_HELPER_CLASS_NAME} {
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease-in-out;
        }
        .${SELECTABLE_GROUP_CLASS_NAME}:hover .${ON_HOVER_HELPER_CLASS_NAME} {
          opacity: 1;
        }
      /* ]]> */
    `;
  }

  private resize(event: MouseEvent): void {
    event.preventDefault();
    const x = Math.min(event.offsetX, this.initialPosition.x);
    const y = Math.min(event.offsetY, this.initialPosition.y);
    const width = Math.abs(event.offsetX - this.initialPosition.x);
    const height = Math.abs(event.offsetY - this.initialPosition.y);
    this.element.move(x, y).size(width, height);
  }

  // prettier-ignore
  private endResize() {
    if (this.element.width() == 0 || this.element.height() == 0) {
      this.container.remove();
    }
    this.container.add(this.element.clone()
      .addClass(ON_HOVER_HELPER_CLASS_NAME)
      .fill('transparent')
      .stroke({ color: SELECTION_COLOR, width: 1 }));
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.endResize);
  }
}
