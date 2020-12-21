import { Svg } from '@svgdotjs/svg.js';

export interface ISvgService {
  handleMouseDownEvent(event: MouseEvent, svg: Svg): void;
  handleClickEvent(event: MouseEvent, svg: Svg): void;
  getStyles(): string;
}
