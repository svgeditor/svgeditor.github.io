export interface ISvgService {
  handleMouseDownEvent(event: MouseEvent): void;
  handleClickEvent(event: MouseEvent): void;
  getStyles(): string;
}
