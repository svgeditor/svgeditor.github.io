import './workspace.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/IAppStateService';
import { AppStateService } from '../../services/impl/AppStateService';
import { USER_ACTION_EVENT_NAME } from '../../constants/constants';
import { IUserAction } from '../../models/user-actions/IUserAction';
import { Size } from '../../models/Size';

export interface IWorkspaceGridProps {
  appStateService?: IAppStateService;
}

export interface IWorkspaceGridState {
  width: number;
  height: number;
  size: number;
  color: string;
  backgroundColor: string;
  whiteboardSize: Size;
}

export default class WorkspaceGrid extends React.Component<IWorkspaceGridProps, IWorkspaceGridState> {
  private svg: SVGSVGElement;

  constructor(props: IWorkspaceGridProps) {
    super(props);
    const appStateService = props.appStateService ? props.appStateService : AppStateService.getInstance();
    this.state = {
      width: 100,
      height: 100,
      size: appStateService.getGridSize(),
      color: appStateService.getGridColor(),
      backgroundColor: appStateService.getGridBackgroundColor(),
      whiteboardSize: appStateService.getWhiteboardSize(),
    };
  }

  public render() {
    return (
      <svg
        ref={(ref) => (this.svg = ref)}
        className='workspace-grid'
        viewBox={this.getViewBox()}
        width={this.state.width}
        height={this.state.height}
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <pattern id='smallGrid' width={this.state.size} height={this.state.size} patternUnits='userSpaceOnUse'>
            <path d={this.getSmallPath()} fill='none' stroke={this.state.color} strokeWidth='0.5' />
          </pattern>
          <pattern id='grid' width={this.state.size * 5} height={this.state.size * 5} patternUnits='userSpaceOnUse'>
            <rect width={this.state.size * 5} height={this.state.size * 5} fill='url(#smallGrid)' />
            <path d={this.getBigPath()} fill='none' stroke={this.state.color} strokeWidth='1' />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill={this.state.backgroundColor} />
        <rect width='100%' height='100%' fill='url(#grid)' />
      </svg>
    );
  }

  public x(x: number): WorkspaceGrid {
    this.svg.setAttribute('x', x + '');
    return this;
  }

  public y(y: number): WorkspaceGrid {
    this.svg.setAttribute('y', y + '');
    return this;
  }

  public size(size: Size): WorkspaceGrid {
    this.setState({ width: size.width, height: size.height });
    return this;
  }

  private getSmallPath() {
    return `M ${this.state.size} 0 L 0 0 0 ${this.state.size}`;
  }

  private getBigPath() {
    return `M ${this.state.size * 5} 0 L 0 0 0 ${this.state.size * 5}`;
  }

  componentDidMount() {
    document.addEventListener(USER_ACTION_EVENT_NAME, this.handleUserActionEvent.bind(this));
  }

  private handleUserActionEvent(event: CustomEvent<IUserAction>) {
    const userAction: IUserAction = event.detail;
    switch (true) {
      default:
      // no thing to do here!
    }
  }

  private getViewBox() {
    return `0 0 ${this.state.whiteboardSize.width} ${this.state.whiteboardSize.height}`;
  }
}
