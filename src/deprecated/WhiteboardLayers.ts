import { Svg } from '@svgdotjs/svg.js';

export class WhiteboardWindow {
  constructor(
    public whiteboard: HTMLElement,
    public whiteboardGrid: HTMLElement,
    public whiteboardWindow: HTMLElement,
    public whiteboardBackground: HTMLElement,
    public whiteboardVerticalRuler: HTMLElement,
    public whiteboardHorizontalRuler: HTMLElement,
    public svgRootElement: Svg
  ) {}
}
