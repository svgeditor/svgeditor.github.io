export class SvgRectangleProps {
  constructor(public backgroundColor: string, public borderColor: string, public borderWidth: number) {}
}

export class SvgRectanglePropsBuilder {
  private _backgroundColor: string;
  private _borderColor: string;
  private _borderWidth: number;

  backgroundColor(backgroundColor: string): SvgRectanglePropsBuilder {
    this._backgroundColor = backgroundColor;
    return this;
  }

  borderColor(borderColor: string): SvgRectanglePropsBuilder {
    this._borderColor = borderColor;
    return this;
  }

  borderWidth(borderWidth: number): SvgRectanglePropsBuilder {
    this._borderWidth = borderWidth;
    return this;
  }

  build(): SvgRectangleProps {
    return new SvgRectangleProps(this._backgroundColor, this._borderColor, this._borderWidth);
  }
}
