import { AppState } from '../../models/app-state/AppState';
import { ZoomLevel } from '../../models/app-state/ZoomLevel';
import { BoundingRectangle } from '../../models/BoundingRectangle';
import { Position } from '../../models/Position';
import { ISvgElementCreateService } from '../ISvgElementCreateService';

export class SvgRectangleCreateService implements ISvgElementCreateService {
  constructor(private appState = AppState.getInstance()) {}

  createOnMouseDown(event: MouseEvent): void {
    const initialMousePosition = this.getMousePositonRelatedToWhiteboard(event);
    const rectangle = this.getSvgRootElement().rect(initialMousePosition);

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      const newMousePosition = this.getMousePositonRelatedToWhiteboard(event);
      const newBoundingRectangle = this.getNewBoundingRectangle(initialMousePosition, newMousePosition);
      rectangle.boundingRectangle(newBoundingRectangle);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
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
