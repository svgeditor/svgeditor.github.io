import { Shape } from '@svgdotjs/svg.js';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { UndoableUserAction } from '../models/user-actions/IUndoableUserAction';
import { SvgShape } from './SvgShape';
import { IWhiteboardDrawingService } from './IWhiteboardDrawingService';

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
