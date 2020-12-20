import { Svg } from '@svgdotjs/svg.js';

export interface ISvgService {
  handleMouseDownEvent(svg: Svg, event: MouseEvent): void;
  handleClickEvent(svg: Svg, event: MouseEvent): void;
  getStyles(): string;
}
