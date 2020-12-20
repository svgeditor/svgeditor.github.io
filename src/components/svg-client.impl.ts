import { SVG, Svg } from '@svgdotjs/svg.js';
import { RectangleFactory } from './rectangle-factory';
import { ISvgClient } from './svg-client.interface';

export class SvgClient implements ISvgClient {
  private static instance: ISvgClient = null;
  private svg: Svg;
  private rectangleFactory: RectangleFactory;

  static getInstance(): ISvgClient {
    if (SvgClient.instance === null) {
      SvgClient.instance = new SvgClient();
    }
    return SvgClient.instance;
  }

  private constructor() {}

  init(container: HTMLElement) {
    this.svg = SVG().addTo(container).size('100%', '100%');
    this.rectangleFactory = new RectangleFactory();
  }

  createRectangle(event: MouseEvent): void {
    this.rectangleFactory.create(this.svg, event);
  }
}
