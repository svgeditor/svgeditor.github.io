export class ZoomPercentage {
  previous: number = 100;
  current: number = 100;

  static zoom(value: number, zoomPercentage: ZoomPercentage): number {
    return Math.floor((value * zoomPercentage.current) / zoomPercentage.previous);
  }
}
