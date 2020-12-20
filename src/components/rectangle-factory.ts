import { randomColor } from 'randomcolor';
import { Rect, Svg } from '@svgdotjs/svg.js';

interface Position {
  x: number;
  y: number;
}

interface ElementOptions {
  initialX: number;
  x: number;
  initialY: number;
  y: number;
  backgroundColor: string;
  width: number;
  height: number;
  zIndex: string;
}

const Z_INDEX_INIT_VALUE = '0';
const Z_INDEX_VALUE_ON_MOUSE_MOVE_EVENT = '1';

export class RectangleFactory {
  private element: Rect;
  private options: ElementOptions;
  private mousePosition: Position;

  constructor() {
    this.resize = this.resize.bind(this);
    this.endResize = this.endResize.bind(this);
    this.move = this.move.bind(this);
    this.endMove = this.endMove.bind(this);
    this.handleElementMouseDownEvent = this.handleElementMouseDownEvent.bind(this);
  }

  create(svg: Svg, event: MouseEvent): void {
    this.element = svg.rect(0, 0);
    this.options = {
      initialX: event.clientX,
      x: event.clientX,
      initialY: event.clientY,
      y: event.clientY,
      backgroundColor: randomColor(),
      width: 0,
      height: 0,
      zIndex: Z_INDEX_INIT_VALUE,
    };
    this.update();
    document.addEventListener('mousemove', this.resize);
    document.addEventListener('mouseup', this.endResize);
    this.element.on('mousedown', this.handleElementMouseDownEvent);
  }

  private resize(event: MouseEvent): void {
    event.preventDefault();
    this.options = {
      ...this.options,
      x: Math.min(event.clientX, this.options.initialX),
      y: Math.min(event.clientY, this.options.initialY),
      width: Math.abs(event.clientX - this.options.initialX),
      height: Math.abs(event.clientY - this.options.initialY),
    };
    this.update();
  }

  private endResize() {
    this.element.data('options', this.options);
    document.removeEventListener('mousemove', this.resize);
    document.removeEventListener('mouseup', this.endResize);
  }

  private update() {
    this.element.size(this.options.width, this.options.height).move(this.options.x, this.options.y).fill(this.options.backgroundColor);
  }

  private handleElementMouseDownEvent(event: MouseEvent) {
    event.stopPropagation();
    this.element = <Rect>(event as any).toElement.instance; // this code is based on console.log(event) and it may generates unexpected behaviors on different browsers! If you find an elegant way to handle this event, please let me know :)
    this.options = this.element.data('options');
    this.mousePosition = { x: event.clientX, y: event.clientY };
    document.addEventListener('mousemove', this.move);
    document.addEventListener('mouseup', this.endMove);
  }

  private move(event: MouseEvent) {
    event.preventDefault();
    let previousMousePosition = { ...this.mousePosition };
    this.mousePosition = { x: event.clientX, y: event.clientY };
    this.options = {
      ...this.options,
      x: this.options.x + (this.mousePosition.x - previousMousePosition.x),
      y: this.options.y + (this.mousePosition.y - previousMousePosition.y),
      zIndex: Z_INDEX_VALUE_ON_MOUSE_MOVE_EVENT,
    };
    this.update();
  }

  private endMove() {
    this.options = { ...this.options, zIndex: Z_INDEX_INIT_VALUE };
    this.update();
    this.element.data('options', this.options);
    document.removeEventListener('mousemove', this.move);
    document.removeEventListener('mouseup', this.endMove);
  }
}
