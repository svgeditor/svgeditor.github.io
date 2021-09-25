import './workspace.scss';
import * as React from 'react';
import { Size } from '../../models/Size';
import { BoundingRectangle } from '../../models/BoundingRectangle';
import { AppState } from '../../models/AppState';

export interface IWorkspaceWhiteboardProps {
  appState?: AppState;
}

export interface IWorkspaceWhiteboardState {
  width: number;
  height: number;
  viewBox: string;
}

export default class WorkspaceWhiteboard extends React.Component<IWorkspaceWhiteboardProps, IWorkspaceWhiteboardState> {
  private svg: SVGSVGElement;

  constructor(props: IWorkspaceWhiteboardProps) {
    super(props);
    const appState = props.appState ? props.appState : AppState.getInstance();
    const zoomedWhiteboardSize = appState.getWhiteboardSize(true);
    this.state = {
      width: zoomedWhiteboardSize.width,
      height: zoomedWhiteboardSize.height,
      viewBox: `0 0 ${appState.getWhiteboardProps().width} ${appState.getWhiteboardProps().height}`,
    };
  }

  public render() {
    return (
      <svg
        ref={(ref) => (this.svg = ref)}
        width={this.state.width}
        height={this.state.height}
        viewBox={this.state.viewBox}
        xmlns='http://www.w3.org/2000/svg'
      >
        {this.props.children}
      </svg>
    );
  }

  public x(x: number): WorkspaceWhiteboard {
    this.svg.setAttribute('x', x + '');
    return this;
  }

  public y(y: number): WorkspaceWhiteboard {
    this.svg.setAttribute('y', y + '');
    return this;
  }

  public size(size: Size): WorkspaceWhiteboard {
    this.setState({ width: size.width, height: size.height });
    return this;
  }

  public getBoundingRectangle(): BoundingRectangle {
    return BoundingRectangle.fromSvgElement(this.svg);
  }
}
