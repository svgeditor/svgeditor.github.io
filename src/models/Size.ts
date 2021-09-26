import { ZoomLevel } from './app-state/ZoomLevel';

export class Size {
  constructor(public width: number, public height: number) {}

  static fromHTMLElement(element: HTMLElement): Size {
    const rect = element.getBoundingClientRect();
    return new Size(rect.width, rect.height);
  }

  static fromSvgElement(element: SVGSVGElement): Size {
    const rect = element.getBoundingClientRect();
    return new Size(rect.width, rect.height);
  }

  zoom(zoomLevel: ZoomLevel): Size {
    return new Size(zoomLevel.getZoomedValue(this.width), zoomLevel.getZoomedValue(this.height));
  }
}
