import { Svg } from '@svgdotjs/svg.js';

export class WhiteboardLayers {
  constructor(
    public whiteboard: HTMLElement,
    public whiteboardWindow: HTMLElement,
    public whiteboardBackground: HTMLElement,
    public whiteboardVerticalRuler: HTMLElement,
    public whiteboardHorizontalRuler: HTMLElement,
    public svgRootElement: Svg
  ) {}
}
