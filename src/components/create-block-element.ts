import { randomColor } from 'randomcolor';

export interface Position {
  x: number;
  y: number;
}

interface ElementOptions {
  initialLeft: number;
  left: number;
  initialTop: number;
  top: number;
  backgroundColor: string;
  width: number;
  height: number;
  zIndex: string;
}

let mousePosition: Position;
let elementPosition: Position;
let newElement: HTMLElement;
let newElementOptions: ElementOptions;

const Z_INDEX_INIT_VALUE = '0';
const Z_INDEX_VALUE_ON_MOUSE_MOVE_EVENT = '1';

export function createBlockElement(event: MouseEvent): HTMLElement {
  newElement = document.createElement('div');
  newElementOptions = {
    initialLeft: event.clientX,
    left: event.clientX,
    initialTop: event.clientY,
    top: event.clientY,
    backgroundColor: randomColor(),
    width: 1,
    height: 1,
    zIndex: Z_INDEX_INIT_VALUE,
  };
  updateElement(newElementOptions);
  document.addEventListener('mousemove', resizeElement);
  document.addEventListener('mouseup', endResizeElement);
  newElement.addEventListener('mousedown', moveElement);
  return newElement;
}

function resizeElement(event: MouseEvent) {
  event.preventDefault();
  mousePosition = { x: event.clientX, y: event.clientY };
  newElementOptions = {
    ...newElementOptions,
    left: Math.min(mousePosition.x, newElementOptions.initialLeft),
    top: Math.min(mousePosition.y, newElementOptions.initialTop),
    width: Math.abs(mousePosition.x - newElementOptions.initialLeft),
    height: Math.abs(mousePosition.y - newElementOptions.initialTop),
  };
  updateElement(newElementOptions);
}

function endResizeElement() {
  document.removeEventListener('mousemove', resizeElement);
  document.removeEventListener('mouseup', endResizeElement);
}

function moveElement(event: MouseEvent) {
  event.stopPropagation();
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

function updateElement(options: ElementOptions) {
  newElement.style.position = 'absolute';
  newElement.style.left = `${options.left}px`;
  newElement.style.top = `${options.top}px`;
  newElement.style.width = `${options.width}px`;
  newElement.style.height = `${options.height}px`;
  newElement.style.backgroundColor = options.backgroundColor;
  newElement.style.zIndex = options.zIndex;
}
