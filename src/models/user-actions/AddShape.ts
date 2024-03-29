import { Shape } from '@svgdotjs/svg.js';
import { IWhiteboardDrawingService } from '../../services/IWhiteboardDrawingService';
import { WhiteboardDrawingService } from '../../services/impl/WhiteboardDrawingService';
import { SvgShape } from '../SvgShape';
import { UndoableUserAction } from './IUndoableUserAction';

export class AddShape extends UndoableUserAction {
  constructor(public shape: SvgShape<Shape>, private whiteboardDrawingService: IWhiteboardDrawingService = WhiteboardDrawingService.getInstance()) {
    super();
  }

  undo(): void {
    this.whiteboardDrawingService.unselectAllShapes();
    this.shape.getContainer().remove();
  }

  redo(): void {
    this.whiteboardDrawingService.draw(this.shape);
  }
}
