import './drawn-shapes.scss';
import * as React from 'react';
import { SvgShape } from '../../models/SvgShape';
import { Shape } from '@svgdotjs/svg.js';
import { USER_ACTION_EVENT_NAME } from '../../constants/constants';
import { IUserAction } from '../../models/user-actions/IUserAction';
import { AddShape } from '../../models/user-actions/AddShape';
import { DeleteShapes } from '../../models/user-actions/DeleteShapes';
import { SelectShapes } from '../../models/user-actions/SelectShapes';
import { UnselectAllShapes } from '../../models/user-actions/UnselectAllShapes';
import { IWhiteboardDrawingService } from '../../services/api/IWhiteboardDrawingService';
import { WhiteboardDrawingService } from '../../services/impl/WhiteboardDrawingService';
import SidebarSection from '../sidebar-section/SidebarSection';

export interface IDrawnShapesProps {
  whiteboardDrawingService?: IWhiteboardDrawingService;
}

export interface IDrawnShapesState {
  shapes: SvgShape<Shape>[];
  selectedShapes: SvgShape<Shape>[];
}

export default class DrawnShapes extends React.Component<IDrawnShapesProps, IDrawnShapesState> {
  private whiteboardDrawingService: IWhiteboardDrawingService;

  constructor(props: IDrawnShapesProps) {
    super(props);
    this.state = {
      shapes: [],
      selectedShapes: [],
    };
    this.whiteboardDrawingService = this.props.whiteboardDrawingService
      ? this.props.whiteboardDrawingService
      : WhiteboardDrawingService.getInstance();
  }

  public render() {
    return (
      <SidebarSection title='Shapes'>
        <div className='drawn-shapes-container'>
          {this.state.shapes.map((shape) => {
            return (
              <div className={this.getShapeClassNames(shape)} onClick={() => this.handleShapeClick(shape)} key={shape.getId()}>
                <span className='iconify' data-icon={shape.getIconName()} data-inline='false'></span>
                <span>{shape.getName()}</span>
              </div>
            );
          })}
        </div>
      </SidebarSection>
    );
  }

  componentDidMount() {
    document.addEventListener(USER_ACTION_EVENT_NAME, this.handleUserActionEvent.bind(this));
  }

  private handleShapeClick(shape: SvgShape<Shape>) {
    this.whiteboardDrawingService.unselectAllShapesToSelectNewShape();
    this.whiteboardDrawingService.select([shape]);
  }

  private getShapeClassNames(shape: SvgShape<Shape>): string {
    let res = 'shape';
    const selectedShapesIds = this.state.selectedShapes.map((shape) => shape.getId());
    if (selectedShapesIds.includes(shape.getId())) res += ' selected-shape';
    return res;
  }

  private handleUserActionEvent(event: CustomEvent<IUserAction>) {
    const userAction: IUserAction = event.detail;
    switch (true) {
      case userAction instanceof DeleteShapes:
        const deletedShapesIds = (userAction as DeleteShapes).shapes.map((shape) => shape.getId());
        const remainingShapes = this.state.shapes.filter((shape) => !deletedShapesIds.includes(shape.getId()));
        this.setState({ shapes: remainingShapes });
        break;
      case userAction instanceof AddShape:
        const newShape = (userAction as AddShape).shape;
        this.setState({ shapes: [...this.state.shapes, newShape] });
        break;
      case userAction instanceof SelectShapes:
        const selectedShapes = (userAction as SelectShapes).shapes;
        this.setState({ selectedShapes: [...selectedShapes] });
        break;
      case userAction instanceof UnselectAllShapes:
        this.setState({ selectedShapes: [] });
        break;
      default:
      // no thing to do here!
    }
  }
}
