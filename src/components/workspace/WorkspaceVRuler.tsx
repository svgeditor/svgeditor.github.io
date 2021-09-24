import './workspace.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/IAppStateService';
import { AppStateService } from '../../services/impl/AppStateService';
import { MathUtils } from '../../utils/MathUtils';
import { ZoomLevel } from '../../models/ZoomLevel';
import { Size } from '../../models/Size';

export interface IWorkspaceVRulerProps {
  appStateService?: IAppStateService;
}

export interface IWorkspaceVRulerState {
  color: string;
  gridSize: number;
  rulerHeight: number;
  whiteboardHeight: number;
  zoomLevel: ZoomLevel;
}

export default class WorkspaceVRuler extends React.Component<IWorkspaceVRulerProps, IWorkspaceVRulerState> {
  private container: HTMLElement;
  private ruler: HTMLElement;

  constructor(props: IWorkspaceVRulerProps) {
    super(props);
    const appStateService = props.appStateService ? props.appStateService : AppStateService.getInstance();
    this.state = {
      color: appStateService.getRulerColor(),
      gridSize: appStateService.getGridSize(),
      rulerHeight: 20,
      whiteboardHeight: appStateService.getWhiteboardSize().height,
      zoomLevel: appStateService.getZoomLevel(),
    };
  }

  public render() {
    const ruleLinesNb = Math.floor(this.state.whiteboardHeight / 10);
    const zoomedGridSize = this.state.zoomLevel.getZoomedValue(this.state.gridSize);
    const zoomedWhiteboardHeight = this.state.zoomLevel.getZoomedValue(this.state.whiteboardHeight);
    const components = [];
    for (let i = 0; i <= ruleLinesNb; i++) {
      if (i % 5 == 0) {
        if (i % 10 == 0) {
          components.push(
            <path key={MathUtils.random()} d={this.getHorizontalLinePath(i, 12, zoomedGridSize, this.state.rulerHeight)} stroke={this.state.color} />
          );
          components.push(
            <text
              key={MathUtils.random()}
              x={-(i * zoomedGridSize + this.getRulerTextMargin(i * this.state.gridSize))}
              y='10'
              fontSize='9'
              fontFamily='sans-serif'
              fill={this.state.color}
              transform='rotate(-90)'
            >
              {i * this.state.gridSize}
            </text>
          );
        } else {
          components.push(
            <path key={MathUtils.random()} d={this.getHorizontalLinePath(i, 10, zoomedGridSize, this.state.rulerHeight)} stroke={this.state.color} />
          );
        }
      } else {
        components.push(
          <path key={MathUtils.random()} d={this.getHorizontalLinePath(i, 15, zoomedGridSize, this.state.rulerHeight)} stroke={this.state.color} />
        );
      }
    }

    return (
      <div ref={(ref) => (this.container = ref)} className='vertical-ruler-container'>
        <div className='vertical-ruler-background'>
          <div ref={(ref) => (this.ruler = ref)} className='vertical-ruler'>
            <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
              {components}
              <path d={this.getRightLinePath(zoomedWhiteboardHeight, this.state.rulerHeight)} stroke={this.state.color} />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  public containerSize(size: Size): WorkspaceVRuler {
    this.container.style.width = size.width + 'px';
    this.container.style.height = size.height + 'px';
    return this;
  }

  public height(height: number): WorkspaceVRuler {
    this.ruler.style.height = height + 'px';
    return this;
  }

  public marginTop(marginTop: number): WorkspaceVRuler {
    this.ruler.style.marginTop = marginTop + 'px';
    return this;
  }

  public zoomLevel(zoomLevel: ZoomLevel): WorkspaceVRuler {
    this.setState({ zoomLevel });
    return this;
  }

  private getRulerTextMargin(nb: number): number {
    return nb.toString().length * 3 - 1;
  }

  private getRightLinePath(whiteboardHeight: number, rulerWidth: number) {
    return `M ${rulerWidth} 0 V ${whiteboardHeight}`;
  }

  private getHorizontalLinePath(i: number, height: number, gridSize: number, rulerHeight: number) {
    return `M ${height} ${i * gridSize} H ${rulerHeight}`;
  }
}
