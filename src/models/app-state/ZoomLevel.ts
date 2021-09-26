import { BoundingRectangle } from '../BoundingRectangle';
import { Position } from '../Position';
import { Size } from '../Size';

export const ZOOM_PERCENTAGE_STEP = 10;
export const MAX_ZOOM_PERCENTAGE = 1000;
export const MIN_ZOOM_PERCENTAGE = 50;

export class ZoomLevel {
  previousPercentageZoom: number = 100;
  currentPercentageZoom: number = 100;

  getZoomedValue(initialValue: number): number {
    return (initialValue * this.currentPercentageZoom) / 100;
  }

  getInitialValue(zoomedValue: number): number {
    return (zoomedValue * 100) / this.currentPercentageZoom;
  }

  getZoomedValueFromInitialValue(initialValue: number): number {
    return (initialValue * this.currentPercentageZoom) / 100;
  }

  getZoomedValueFromPreviousValue(previousValue: number): number {
    return (previousValue * this.currentPercentageZoom) / this.previousPercentageZoom;
  }

  increase() {
    if (this.currentPercentageZoom == MAX_ZOOM_PERCENTAGE) {
      this.previousPercentageZoom = MAX_ZOOM_PERCENTAGE;
      return;
    }
    const currentPercentageZoom = this.currentPercentageZoom;
    this.previousPercentageZoom = currentPercentageZoom;
    this.currentPercentageZoom = currentPercentageZoom + ZOOM_PERCENTAGE_STEP;
  }

  decrease() {
    if (this.currentPercentageZoom == MIN_ZOOM_PERCENTAGE) {
      this.previousPercentageZoom = MIN_ZOOM_PERCENTAGE;
      return;
    }
    const currentPercentageZoom = this.currentPercentageZoom;
    this.previousPercentageZoom = currentPercentageZoom;
    this.currentPercentageZoom = currentPercentageZoom - ZOOM_PERCENTAGE_STEP;
  }
}
