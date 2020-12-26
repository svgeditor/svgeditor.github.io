import { Shape } from '@svgdotjs/svg.js';
import { IWhiteboardDrawingService } from '../services/api/IWhiteboardDrawingService';

export interface IUndoableAction {
  undo(): IUndoableAction;
  redo(): IUndoableAction;
}

export class AddShapeAction implements IUndoableAction {
  constructor(private shape: Shape, private whiteboardDrawingService: IWhiteboardDrawingService) {}

  undo(): IUndoableAction {
    this.whiteboardDrawingService.unselectAll();
    this.shape.remove();
    return this;
  }

  redo(): IUndoableAction {
    this.whiteboardDrawingService.draw(this.shape);
    return this;
  }
}

export class DeleteSelectedShapesAction implements IUndoableAction {
  constructor(private selectedShapes: Shape[], private whiteboardDrawingService: IWhiteboardDrawingService) {}

  undo(): IUndoableAction {
    this.whiteboardDrawingService.unselectAll();
    this.selectedShapes.forEach((shape) => this.whiteboardDrawingService.draw(shape));
    return this;
  }

  redo(): IUndoableAction {
    this.selectedShapes.forEach((shape) => shape.remove());
    return this;
  }
}
