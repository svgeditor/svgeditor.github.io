import './right-sidebar.scss';
import * as React from 'react';
import { SvgShape } from '../../models/SvgShape';
import { Circle, Ellipse, Line, Rect, Shape } from '@svgdotjs/svg.js';
import WhiteboardProperties from './whiteboard-properties/WhiteboardProperties';
import ShapesProperties from './shapes-properties/ShapesProperties';
import RectangleProperties from './rectangle-properties/RectangleProperties';
import CircleProperties from './circle-properties/CircleProperties';
import EllipseProperties from './ellipse-properties/EllipseProperties';
import LineProperties from './line-properties/LineProperties';
import { USER_ACTION_EVENT_NAME } from '../../constants/constants';
import { IUserAction } from '../../models/user-actions/IUserAction';
import { SelectShapes } from '../../models/user-actions/SelectShapes';
import { UnselectAllShapes } from '../../models/user-actions/UnselectAllShapes';

export interface IRightSidebarProps {}

export interface IRightSidebarState {
  selectedShapes: SvgShape<Shape>[];
}

export default class RightSidebar extends React.Component<IRightSidebarProps, IRightSidebarState> {
  constructor(props: IRightSidebarProps) {
    super(props);

    this.state = {
      selectedShapes: [],
    };
  }

  public render() {
    return <div className='right-sidebar-container'>{this.getComponentToRender()}</div>;
  }

  public componentDidMount() {
    document.addEventListener(USER_ACTION_EVENT_NAME, this.handleUserActionEvent.bind(this));
  }

  private handleUserActionEvent(event: CustomEvent<IUserAction>) {
    const userAction: IUserAction = event.detail;
    switch (true) {
      case userAction instanceof SelectShapes:
        return this.setState({ selectedShapes: [...(userAction as SelectShapes).shapes] });
      case userAction instanceof UnselectAllShapes:
        return this.setState({ selectedShapes: [] });
      default:
      // no thing to do here!
    }
  }

  private getComponentToRender() {
    if (this.state.selectedShapes.length == 0) {
      return <WhiteboardProperties></WhiteboardProperties>;
    }
    if (this.state.selectedShapes.length > 1) {
      return <ShapesProperties></ShapesProperties>;
    }
    const selectedShape = this.state.selectedShapes[0];
    switch (true) {
      case selectedShape.getShape() instanceof Rect:
        return <RectangleProperties></RectangleProperties>;
      case selectedShape.getShape() instanceof Circle:
        return <CircleProperties></CircleProperties>;
      case selectedShape.getShape() instanceof Ellipse:
        return <EllipseProperties></EllipseProperties>;
      case selectedShape.getShape() instanceof Line:
        return <LineProperties></LineProperties>;
      default:
        return <WhiteboardProperties></WhiteboardProperties>;
    }
  }
}
