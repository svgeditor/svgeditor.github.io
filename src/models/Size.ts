export class Size {
  constructor(public width: number, public height: number) {}

  static fromDOMRect(rect: DOMRect): Size {
    return new Size(rect.width, rect.height);
  }
}
