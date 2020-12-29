import { Shape } from '@svgdotjs/svg.js';
import { IWhiteboardDrawingService } from '../../services/api/IWhiteboardDrawingService';
import { WhiteboardDrawingService } from '../../services/impl/WhiteboardDrawingService';
import { ShapeInfo } from '../ShapeInfo';
import { UndoableUserAction } from './IUndoableUserAction';

export class AddShape extends UndoableUserAction {
  constructor(private shape: ShapeInfo<Shape>, private whiteboardDrawingService: IWhiteboardDrawingService = WhiteboardDrawingService.getInstance()) {
    super();
  }

  undo(): void {
    this.whiteboardDrawingService.unselectAll();
    this.shape.container.remove();
  }

  redo(): void {
    this.whiteboardDrawingService.draw(this.shape);
  }
}
