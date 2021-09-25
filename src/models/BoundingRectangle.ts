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
}
