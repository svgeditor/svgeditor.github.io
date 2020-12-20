import { IBackgroundGridService } from './IBackgroundGridService';

export class BackgroundGridService implements IBackgroundGridService {
  add(element: HTMLElement): void {
    const elementBoundingClientRect = element.getBoundingClientRect();

    const horizontalLinesNb = (elementBoundingClientRect.height - (elementBoundingClientRect.height % 10)) / 10;
    for (let index = 0; index <= horizontalLinesNb; index++) {
      let div = document.createElement('div');
      div.classList.add('grid');
      div.style.position = 'absolute';
      div.style.width = '100%';
      div.style.height = index % 5 == 0 ? '2px' : '1px';
      div.style.zIndex = '-100';
      div.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
      div.style.top = `${index * 10}px`;
      div.style.left = '0';
      element.appendChild(div);
    }

    const verticalLinesNb = (elementBoundingClientRect.width - (elementBoundingClientRect.width % 10)) / 10;
    for (let index = 0; index <= verticalLinesNb; index++) {
      let div = document.createElement('div');
      div.classList.add('grid');
      div.style.position = 'absolute';
      div.style.width = index % 5 == 0 ? '2px' : '1px';
      div.style.height = '100%';
      div.style.zIndex = '-100';
      div.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
      div.style.top = '0';
      div.style.left = `${index * 10}px`;
      element.appendChild(div);
    }
  }

  remove(element: HTMLElement): void {
    element.querySelectorAll('.grid').forEach((e) => e.remove());
  }

  reset(element: HTMLElement): void {
    this.remove(element);
    this.add(element);
  }
}
