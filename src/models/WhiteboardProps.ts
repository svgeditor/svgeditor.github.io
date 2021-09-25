import { Size } from './Size';
import { SvgRootElement } from './svg-elements/SvgRootElement';

export class WhiteboardProps {
  constructor(public width: number, public height: number, public svgRootElement: SvgRootElement) {}

  getSize(): Size {
    return new Size(this.width, this.height);
  }
}

export class WhiteboardPropsBuilder {
  private _width: number;
  private _height: number;
  private _svgRootElement: SvgRootElement;

  width(width: number): WhiteboardPropsBuilder {
    this._width = width;
    return this;
  }

  height(height: number): WhiteboardPropsBuilder {
    this._height = height;
    return this;
  }

  svgRootElement(svgRootElement: SvgRootElement): WhiteboardPropsBuilder {
    this._svgRootElement = svgRootElement;
    return this;
  }

  build(): WhiteboardProps {
    return new WhiteboardProps(this._width, this._height, this._svgRootElement);
  }
}
