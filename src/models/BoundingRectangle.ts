import { ZoomLevel } from './app-state/ZoomLevel';

export class BoundingRectangle {
  constructor(public x: number, public y: number, public width: number, public height: number) {}

  static fromHTMLElement(element: HTMLElement): BoundingRectangle {
    const rect = element.getBoundingClientRect();
    return new BoundingRectangle(rect.x, rect.y, rect.width, rect.height);
  }

  static fromSvgElement(svg: SVGSVGElement): BoundingRectangle {
    const x = parseInt(svg.getAttribute('x'));
    const y = parseInt(svg.getAttribute('y'));
    const width = parseInt(svg.getAttribute('width'));
    const height = parseInt(svg.getAttribute('height'));
    return new BoundingRectangle(x, y, width, height);
  }

  zoom(zoomLevel: ZoomLevel): BoundingRectangle {
    const x = zoomLevel.getZoomedValue(this.x);
    const y = zoomLevel.getZoomedValue(this.y);
    const width = zoomLevel.getZoomedValue(this.width);
    const height = zoomLevel.getZoomedValue(this.height);
    return new BoundingRectangle(x, y, width, height);
  }

  unZoom(zoomLevel: ZoomLevel): BoundingRectangle {
    const x = zoomLevel.getInitialValue(this.x);
    const y = zoomLevel.getInitialValue(this.y);
    const width = zoomLevel.getInitialValue(this.width);
    const height = zoomLevel.getInitialValue(this.height);
    return new BoundingRectangle(x, y, width, height);
  }
}
