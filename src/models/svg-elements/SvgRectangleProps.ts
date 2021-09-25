export class SvgRectangleProps {
  constructor(public fill: string, public strokeColor: string, public strokeWidth: number) {}
}

export class SvgRectanglePropsBuilder {
  private _fill: string;
  private _strokeColor: string;
  private _strokeWidth: number;

  fill(fill: string): SvgRectanglePropsBuilder {
    this._fill = fill;
    return this;
  }

  strokeColor(strokeColor: string): SvgRectanglePropsBuilder {
    this._strokeColor = strokeColor;
    return this;
  }

  strokeWidth(strokeWidth: number): SvgRectanglePropsBuilder {
    this._strokeWidth = strokeWidth;
    return this;
  }

  build(): SvgRectangleProps {
    return new SvgRectangleProps(this._fill, this._strokeColor, this._strokeWidth);
  }
}
