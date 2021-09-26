export class ScrollInfo {
  scrollX: number;
  scrollY: number;
  continueScroll?: boolean;

  static form(element: HTMLElement): ScrollInfo {
    const scrollInfo = new ScrollInfo();
    scrollInfo.scrollX = element.scrollLeft;
    scrollInfo.scrollY = element.scrollTop;
    scrollInfo.continueScroll = true;
    return scrollInfo;
  }
}
