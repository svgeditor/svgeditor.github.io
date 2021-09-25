import './workspace.scss';
import * as React from 'react';
import { Size } from '../../models/Size';
import { IAppStateService } from '../../services/IAppStateService';
import { AppStateService } from '../../services/impl/AppStateService';
import { BoundingRectangle } from '../../models/BoundingRectangle';

export interface IWorkspaceWhiteboardProps {
  appStateService?: IAppStateService;
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
    const appStateService = props.appStateService ? props.appStateService : AppStateService.getInstance();
    const zoomedWhiteboardSize = appStateService.getWhiteboardSize(true);
    this.state = {
      width: zoomedWhiteboardSize.width,
      height: zoomedWhiteboardSize.height,
      viewBox: `0 0 ${appStateService.getInitialWhiteboardWidth()} ${appStateService.getInitialWhiteboardHeight()}`,
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
