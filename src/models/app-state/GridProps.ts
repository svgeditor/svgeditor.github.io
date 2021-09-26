export class GridProps {
  constructor(public color: string, public backgroundColor: string, public size: number) {}
}

export class GridPropsBuilder {
  private _color: string;
  private _backgroundColor: string;
  private _size: number;

  color(color: string): GridPropsBuilder {
    this._color = color;
    return this;
  }

  backgroundColor(backgroundColor: string): GridPropsBuilder {
    this._backgroundColor = backgroundColor;
    return this;
  }

  size(size: number): GridPropsBuilder {
    this._size = size;
    return this;
  }

  build(): GridProps {
    return new GridProps(this._color, this._backgroundColor, this._size);
  }
}
