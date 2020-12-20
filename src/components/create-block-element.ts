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

let element: HTMLElement;
let elementOptions: ElementOptions;
let mousePosition: Position;

const Z_INDEX_INIT_VALUE = '0';
const Z_INDEX_VALUE_ON_MOUSE_MOVE_EVENT = '1';

export function createBlockElement(event: MouseEvent): HTMLElement {
  element = document.createElement('div');
  elementOptions = {
    initialLeft: event.clientX,
    left: event.clientX,
    initialTop: event.clientY,
    top: event.clientY,
    backgroundColor: randomColor(),
    width: 1,
    height: 1,
    zIndex: Z_INDEX_INIT_VALUE,
  };
  updateElement(elementOptions);
  element.addEventListener('mousedown', moveElement);
  document.addEventListener('mousemove', resizeElement);
  document.addEventListener('mouseup', endResizeElement);
  return element;
}

function addResizeGuides() {
  const guideHalfSize = '7px';
  const P1 = document.createElement('div');
  P1.classList.add('resize-guide');
  P1.style.cursor = 'nwse-resize';
  P1.style.position = 'absolute';
  P1.style.top = `-${guideHalfSize}`;
  P1.style.left = `-${guideHalfSize}`;
  P1.addEventListener('mousedown', (event) => {
    elementOptions = {
      ...elementOptions,
      initialLeft: elementOptions.left + elementOptions.width,
      initialTop: elementOptions.top + elementOptions.height,
    };
    handleResizeGuideMouseDownEvent(event);
  });
  element.append(P1);
  const P2 = document.createElement('div');
  P2.classList.add('resize-guide');
  P2.style.cursor = 'ns-resize';
  P2.style.position = 'absolute';
  P2.style.top = `-${guideHalfSize}`;
  P2.style.left = `calc(50% - ${guideHalfSize})`;
  P2.addEventListener('mousedown', (event) => {
    elementOptions = {
      ...elementOptions,
      initialTop: elementOptions.top + elementOptions.height,
    };
    handleResizeGuideMouseDownEvent_YDirection(event);
  });
  element.append(P2);
  const P3 = document.createElement('div');
  P3.classList.add('resize-guide');
  P3.style.cursor = 'nesw-resize';
  P3.style.position = 'absolute';
  P3.style.top = `-${guideHalfSize}`;
  P3.style.right = `-${guideHalfSize}`;
  P3.addEventListener('mousedown', (event) => {
    elementOptions = {
      ...elementOptions,
      initialLeft: elementOptions.left,
      initialTop: elementOptions.top + elementOptions.height,
    };
    handleResizeGuideMouseDownEvent(event);
  });
  element.append(P3);
  const P4 = document.createElement('div');
  P4.classList.add('resize-guide');
  P4.style.cursor = 'ew-resize';
  P4.style.position = 'absolute';
  P4.style.top = `calc(50% - ${guideHalfSize})`;
  P4.style.right = `-${guideHalfSize}`;
  P4.addEventListener('mousedown', (event) => {
    elementOptions = {
      ...elementOptions,
      initialLeft: elementOptions.left,
    };
    handleResizeGuideMouseDownEvent_XDirection(event);
  });
  element.append(P4);
  const P5 = document.createElement('div');
  P5.classList.add('resize-guide');
  P5.style.cursor = 'nwse-resize';
  P5.style.position = 'absolute';
  P5.style.bottom = `-${guideHalfSize}`;
  P5.style.right = `-${guideHalfSize}`;
  P5.addEventListener('mousedown', (event) => {
    elementOptions = {
      ...elementOptions,
      initialLeft: elementOptions.left,
      initialTop: elementOptions.top,
    };
    handleResizeGuideMouseDownEvent(event);
  });
  element.append(P5);
  const P6 = document.createElement('div');
  P6.classList.add('resize-guide');
  P6.style.cursor = 'ns-resize';
  P6.style.position = 'absolute';
  P6.style.bottom = `-${guideHalfSize}`;
  P6.style.left = `calc(50% - ${guideHalfSize})`;
  P6.addEventListener('mousedown', (event) => {
    elementOptions = {
      ...elementOptions,
      initialTop: elementOptions.top,
    };
    handleResizeGuideMouseDownEvent_YDirection(event);
  });
  element.append(P6);
  const P7 = document.createElement('div');
  P7.classList.add('resize-guide');
  P7.style.cursor = 'nesw-resize';
  P7.style.position = 'absolute';
  P7.style.bottom = `-${guideHalfSize}`;
  P7.style.left = `-${guideHalfSize}`;
  P7.addEventListener('mousedown', (event) => {
    elementOptions = {
      ...elementOptions,
      initialLeft: elementOptions.left + elementOptions.width,
      initialTop: elementOptions.top,
    };
    handleResizeGuideMouseDownEvent(event);
  });
  element.append(P7);
  const P8 = document.createElement('div');
  P8.classList.add('resize-guide');
  P8.style.cursor = 'ew-resize';
  P8.style.position = 'absolute';
  P8.style.top = `calc(50% - ${guideHalfSize})`;
  P8.style.left = `-${guideHalfSize}`;
  P8.addEventListener('mousedown', (event) => {
    elementOptions = {
      ...elementOptions,
      initialLeft: elementOptions.left + elementOptions.width,
    };
    handleResizeGuideMouseDownEvent_XDirection(event);
  });
  element.append(P8);
  element.classList.add('resizable');
}

function handleResizeGuideMouseDownEvent(event) {
  event.preventDefault();
  event.stopPropagation();
  element = <HTMLElement>event.target.parentNode;
  document.addEventListener('mousemove', resizeElement);
  document.addEventListener('mouseup', endResizeElement);
}

function handleResizeGuideMouseDownEvent_XDirection(event) {
  event.preventDefault();
  event.stopPropagation();
  element = <HTMLElement>event.target.parentNode;
  document.addEventListener('mousemove', resizeElement_XDirection);
  document.addEventListener('mouseup', endResizeElement_XDirection);
}

function handleResizeGuideMouseDownEvent_YDirection(event) {
  event.preventDefault();
  event.stopPropagation();
  element = <HTMLElement>event.target.parentNode;
  document.addEventListener('mousemove', resizeElement_YDirection);
  document.addEventListener('mouseup', endResizeElement_YDirection);
}

function resizeElement(event: MouseEvent) {
  event.preventDefault();
  mousePosition = { x: event.clientX, y: event.clientY };
  elementOptions = {
    ...elementOptions,
    left: Math.min(mousePosition.x, elementOptions.initialLeft),
    top: Math.min(mousePosition.y, elementOptions.initialTop),
    width: Math.abs(mousePosition.x - elementOptions.initialLeft),
    height: Math.abs(mousePosition.y - elementOptions.initialTop),
  };
  updateElement(elementOptions);
}

function resizeElement_XDirection(event: MouseEvent) {
  event.preventDefault();
  mousePosition = { x: event.clientX, y: event.clientY };
  elementOptions = {
    ...elementOptions,
    left: Math.min(mousePosition.x, elementOptions.initialLeft),
    width: Math.abs(mousePosition.x - elementOptions.initialLeft),
  };
  updateElement(elementOptions);
}

function resizeElement_YDirection(event: MouseEvent) {
  event.preventDefault();
  mousePosition = { x: event.clientX, y: event.clientY };
  elementOptions = {
    ...elementOptions,
    top: Math.min(mousePosition.y, elementOptions.initialTop),
    height: Math.abs(mousePosition.y - elementOptions.initialTop),
  };
  updateElement(elementOptions);
}

function endResizeElement() {
  addResizeGuides();
  document.removeEventListener('mousemove', resizeElement);
  document.removeEventListener('mouseup', endResizeElement);
}

function endResizeElement_XDirection() {
  addResizeGuides();
  document.removeEventListener('mousemove', resizeElement_XDirection);
  document.removeEventListener('mouseup', endResizeElement_XDirection);
}

function endResizeElement_YDirection() {
  addResizeGuides();
  document.removeEventListener('mousemove', resizeElement_YDirection);
  document.removeEventListener('mouseup', endResizeElement_YDirection);
}

function moveElement(event: MouseEvent) {
  event.stopPropagation();
  mousePosition = { x: event.clientX, y: event.clientY };
  document.addEventListener('mouseup', handleMouseUpEvent);
  document.addEventListener('mousemove', handleMouseMoveEvent);
}

function handleMouseMoveEvent(event: MouseEvent) {
  event.preventDefault();
  element = <HTMLElement>event.target;
  let previousMousePosition = { ...mousePosition };
  mousePosition = { x: event.clientX, y: event.clientY };
  elementOptions = {
    ...elementOptions,
    left: elementOptions.left + (mousePosition.x - previousMousePosition.x),
    top: elementOptions.top + (mousePosition.y - previousMousePosition.y),
    zIndex: Z_INDEX_VALUE_ON_MOUSE_MOVE_EVENT,
  };
  updateElement(elementOptions);
}

function handleMouseUpEvent(event: MouseEvent) {
  const target = <HTMLElement>event.target;
  target.style.zIndex = Z_INDEX_INIT_VALUE;
  document.removeEventListener('mouseup', handleMouseUpEvent);
  document.removeEventListener('mousemove', handleMouseMoveEvent);
}

function updateElement(options: ElementOptions) {
  element.style.position = 'absolute';
  element.style.left = `${options.left}px`;
  element.style.top = `${options.top}px`;
  element.style.width = `${options.width}px`;
  element.style.height = `${options.height}px`;
  element.style.backgroundColor = options.backgroundColor;
  element.style.zIndex = options.zIndex;
}
