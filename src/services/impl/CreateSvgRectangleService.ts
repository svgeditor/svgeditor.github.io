import { AppState } from '../../models/app-state/AppState';
import { ZoomLevel } from '../../models/app-state/ZoomLevel';
import { BoundingRectangle } from '../../models/BoundingRectangle';
import { Position } from '../../models/Position';
import { SvgGroup } from '../../models/svg-elements/SvgGroup';
import { SvgHoverHelperElement } from '../../models/svg-elements/SvgHoverHelperElement';
import { SvgRectangle } from '../../models/svg-elements/SvgRectangle';
import { ICreateSvgElementService } from '../ICreateSvgElementService';

export class CreateSvgRectangleService implements ICreateSvgElementService {
  constructor(private appState = AppState.getInstance()) {}

  createOnMouseDown(event: MouseEvent): void {
    const initialMousePosition = this.getMousePositonRelatedToWhiteboard(event);
    const group = this.getSvgRootElement().group();
    const rectangle = group.rect(initialMousePosition);
    const onMouseMove = (event: MouseEvent) => this.onMouseMove(event, initialMousePosition, rectangle);
    const onMouseUp = () => this.createOnMouseUp(group, rectangle, onMouseMove, onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  private createOnMouseUp(group: SvgGroup, rectangle: SvgRectangle, onMouseMove: (event: MouseEvent) => void, onMouseUp: () => void) {
    if (rectangle.isNone()) {
      this.getSvgRootElement().remove(group);
    } else {
      group.add(new SvgHoverHelperElement(rectangle.getBoundingRectangle()));
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  private onMouseMove(event: MouseEvent, initialMousePosition: Position, rectangle: SvgRectangle) {
    event.preventDefault();
    const newMousePosition = this.getMousePositonRelatedToWhiteboard(event);
    const newBoundingRectangle = this.getNewBoundingRectangle(initialMousePosition, newMousePosition);
    rectangle.boundingRectangle(newBoundingRectangle);
  }

  private getMousePositonRelatedToWhiteboard(event: MouseEvent): Position {
    const whiteboardBoundingRectangle = this.getSvgRootElement().getBoundingRectangle();
    const x = event.offsetX - whiteboardBoundingRectangle.x;
    const y = event.offsetY - whiteboardBoundingRectangle.y;
    return new Position(x, y).unZoom(this.getZoomLevel());
  }

  private getNewBoundingRectangle(initialMousePosition: Position, newMousePosition: Position): BoundingRectangle {
    const x = Math.min(newMousePosition.x, initialMousePosition.x);
    const y = Math.min(newMousePosition.y, initialMousePosition.y);
    const width = Math.abs(newMousePosition.x - initialMousePosition.x);
    const height = Math.abs(newMousePosition.y - initialMousePosition.y);
    return new BoundingRectangle(x, y, width, height);
  }

  private getZoomLevel(): ZoomLevel {
    return this.appState.getZoomLevel();
  }

  private getSvgRootElement() {
    return this.appState.getSvgRootElement();
  }
}
