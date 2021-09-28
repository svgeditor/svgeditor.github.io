import { AppState } from '../../models/app-state/AppState';
import { SvgGroup } from '../../models/svg-elements/SvgGroup';
import { SvgMoveHelperElement } from '../../models/svg-elements/SvgMoveHelperElement';
import { IMoveSvgElementService } from '../IMoveSvgElementService';

export class MoveSvgElementService implements IMoveSvgElementService {
  constructor(private appState = AppState.getInstance()) {}

  moveOnMouseDown(event: MouseEvent, svgGroup: SvgGroup): void {
    let mousePosition = { x: event.clientX, y: event.clientY };
    const moveHelper = new SvgMoveHelperElement(svgGroup.getBoundingRectangle());
    this.appState.getSvgRootElement().add(moveHelper);
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      let previousMousePosition = { ...mousePosition };
      mousePosition = { x: event.clientX, y: event.clientY };
      const x = svgGroup.x() + (mousePosition.x - previousMousePosition.x);
      const y = svgGroup.y() + (mousePosition.y - previousMousePosition.y);
      svgGroup.move(x, y);
    };
    const onMouseUp = () => {
      this.appState.getSvgRootElement().remove(moveHelper);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
}
