export class ZoomPercentage {
  previous: number = 100;
  current: number = 100;

  static zoom(value: number, zoomPercentage: ZoomPercentage): number {
    return (value * zoomPercentage.current) / zoomPercentage.previous;
  }
}
