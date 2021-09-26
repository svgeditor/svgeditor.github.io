export class RulerProps {
  constructor(public color: string, public backgroundColor: string, public size: number) {}
}

export class RulerPropsBuilder {
  private _color: string;
  private _backgroundColor: string;
  private _size: number;

  color(color: string): RulerPropsBuilder {
    this._color = color;
    return this;
  }

  backgroundColor(backgroundColor: string): RulerPropsBuilder {
    this._backgroundColor = backgroundColor;
    return this;
  }

  size(size: number): RulerPropsBuilder {
    this._size = size;
    return this;
  }

  build(): RulerProps {
    return new RulerProps(this._color, this._backgroundColor, this._size);
  }
}
