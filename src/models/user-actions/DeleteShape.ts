import { Shape } from '@svgdotjs/svg.js';
import { IWhiteboardDrawingService } from '../../services/api/IWhiteboardDrawingService';
import { WhiteboardDrawingService } from '../../services/impl/WhiteboardDrawingService';
import { ShapeInfo } from '../ShapeInfo';
import { UndoableUserAction } from './IUndoableUserAction';

export class DeleteShape extends UndoableUserAction {
  constructor(public shape: ShapeInfo<Shape>, private whiteboardDrawingService: IWhiteboardDrawingService = WhiteboardDrawingService.getInstance()) {
    super();
  }

  undo(): void {
    this.whiteboardDrawingService.unselectAll();
    this.whiteboardDrawingService.draw(this.shape);
  }

  redo(): void {
    this.shape.container.remove();
  }
}
