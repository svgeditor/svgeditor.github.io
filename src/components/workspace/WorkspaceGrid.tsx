import './workspace.scss';
import * as React from 'react';
import { USER_ACTION_EVENT_NAME } from '../../constants/constants';
import { IUserAction } from '../../models/user-actions/IUserAction';
import { Size } from '../../models/Size';
import { ZoomLevel } from '../../models/app-state/ZoomLevel';
import { AppState } from '../../models/app-state/AppState';

export interface IWorkspaceGridProps {
  appState?: AppState;
}

export interface IWorkspaceGridState {
  width: number;
  height: number;
  size: number;
  color: string;
  backgroundColor: string;
  zoomLevel: ZoomLevel;
}

export default class WorkspaceGrid extends React.Component<IWorkspaceGridProps, IWorkspaceGridState> {
  private svg: SVGSVGElement;

  constructor(props: IWorkspaceGridProps) {
    super(props);
    const appState = props.appState ? props.appState : AppState.getInstance();
    this.state = {
      width: 100,
      height: 100,
      size: appState.getGridProps().size,
      color: appState.getGridProps().color,
      backgroundColor: appState.getGridProps().backgroundColor,
      zoomLevel: appState.getZoomLevel(),
    };
  }

  public render() {
    return (
      <svg
        ref={(ref) => (this.svg = ref)}
        className='workspace-grid'
        width={this.state.width}
        height={this.state.height}
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <pattern id='smallGrid' width={this.getZoomedGridSize()} height={this.getZoomedGridSize()} patternUnits='userSpaceOnUse'>
            <path d={this.getSmallPath()} fill='none' stroke={this.state.color} strokeWidth='0.5' />
          </pattern>
          <pattern id='grid' width={this.getZoomedGridSize() * 5} height={this.getZoomedGridSize() * 5} patternUnits='userSpaceOnUse'>
            <rect width={this.getZoomedGridSize() * 5} height={this.getZoomedGridSize() * 5} fill='url(#smallGrid)' />
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
    return `M ${this.getZoomedGridSize()} 0 L 0 0 0 ${this.getZoomedGridSize()}`;
  }

  private getBigPath() {
    return `M ${this.getZoomedGridSize() * 5} 0 L 0 0 0 ${this.getZoomedGridSize() * 5}`;
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

  private getZoomedGridSize(): number {
    return this.state.zoomLevel.getZoomedValue(this.state.size);
  }
}
