import { randomColor } from 'randomcolor';

export interface Position {
  x: number;
  y: number;
}

let mousePosition: Position;
let elementPosition: Position;

const Z_INDEX_INIT_VALUE = '0';
const Z_INDEX_VALUE_ON_MOUSE_MOVE_EVENT = '1';

export function createBlockElement(event: MouseEvent): HTMLElement {
  const element = document.createElement('div');
  element.classList.add('draggable');
  element.style.position = 'absolute';
  element.style.left = `${event.clientX}px`;
  element.style.top = `${event.clientY}px`;
  element.style.width = '150px';
  element.style.height = '75px';
  element.style.borderRadius = '3px';
  element.style.backgroundColor = randomColor();
  element.style.cursor = 'cursor';
  element.style.zIndex = Z_INDEX_INIT_VALUE;
  element.addEventListener('mousedown', handleMouseDownEvent);
  return element;
}

function handleMouseDownEvent(event: MouseEvent) {
  const target = <HTMLElement>event.target;
  const targetBoundingClientRect = target.getBoundingClientRect();
  mousePosition = { x: event.clientX, y: event.clientY };
  elementPosition = { x: targetBoundingClientRect.x, y: targetBoundingClientRect.y };
  document.addEventListener('mouseup', handleMouseUpEvent);
  document.addEventListener('mousemove', handleMouseMoveEvent);
}

function handleMouseMoveEvent(event: MouseEvent) {
  event.preventDefault();
  const target = <HTMLElement>event.target;
  let previousMousePosition = { ...mousePosition };
  mousePosition = { x: event.clientX, y: event.clientY };
  elementPosition = {
    x: elementPosition.x + (mousePosition.x - previousMousePosition.x),
    y: elementPosition.y + (mousePosition.y - previousMousePosition.y),
  };
  target.style.left = `${elementPosition.x}px`;
  target.style.top = `${elementPosition.y}px`;
  target.style.zIndex = Z_INDEX_VALUE_ON_MOUSE_MOVE_EVENT;
}

function handleMouseUpEvent(event: MouseEvent) {
  const target = <HTMLElement>event.target;
  target.style.zIndex = Z_INDEX_INIT_VALUE;
  document.removeEventListener('mouseup', handleMouseUpEvent);
  document.removeEventListener('mousemove', handleMouseMoveEvent);
}
