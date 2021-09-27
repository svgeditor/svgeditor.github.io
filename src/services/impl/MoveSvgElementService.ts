import { SvgGroup } from '../../models/svg-elements/SvgGroup';
import { IMoveSvgElementService } from '../IMoveSvgElementService';

export class MoveSvgElementService implements IMoveSvgElementService {
  constructor() {}

  moveOnMouseDown(event: MouseEvent, svgGroup: SvgGroup): void {
    let mousePosition = { x: event.clientX, y: event.clientY };
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      let previousMousePosition = { ...mousePosition };
      mousePosition = { x: event.clientX, y: event.clientY };
      const x = svgGroup.x() + (mousePosition.x - previousMousePosition.x);
      const y = svgGroup.y() + (mousePosition.y - previousMousePosition.y);
      svgGroup.move(x, y);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}
