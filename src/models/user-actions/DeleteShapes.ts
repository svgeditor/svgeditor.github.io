import { Shape } from '@svgdotjs/svg.js';
import { IWhiteboardDrawingService } from '../../services/IWhiteboardDrawingService';
import { WhiteboardDrawingService } from '../../services/impl/WhiteboardDrawingService';
import { SvgShape } from '../SvgShape';
import { UndoableUserAction } from './IUndoableUserAction';

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
