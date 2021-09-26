import { Shape } from '@svgdotjs/svg.js';
import { WhiteboardDrawingService } from './WhiteboardDrawingService';
import { UndoableUserAction } from '../models/user-actions/IUndoableUserAction';
import { SvgShape } from './SvgShape';
import { IWhiteboardDrawingService } from './IWhiteboardDrawingService';

export class DeleteShapes extends UndoableUserAction {
  constructor(
    public shapes: SvgShape<Shape>[],
    private whiteboardDrawingService: IWhiteboardDrawingService = WhiteboardDrawingService.getInstance()
  ) {
    super();
  }

  undo(): void {
    this.whiteboardDrawingService.unselectAllShapes();
    this.shapes.forEach((shape) => this.whiteboardDrawingService.draw(shape));
  }

  redo(): void {
    this.shapes.forEach((shape) => shape.getContainer().remove());
  }
}
