export const ZOOM_PERCENTAGE_STEP = 15;
export const MAX_ZOOM_PERCENTAGE = 600;
export const MIN_ZOOM_PERCENTAGE = 100;

export class ZoomLevel {
  previousPercentageZoom: number = 100;
  currentPercentageZoom: number = 100;

  getZoomedValueFromInitialValue(initialValue: number): number {
    return (initialValue * this.currentPercentageZoom) / 100;
  }

  getZoomedValueFromPreviousValue(previousValue: number): number {
    return (previousValue * this.currentPercentageZoom) / this.previousPercentageZoom;
  }
}