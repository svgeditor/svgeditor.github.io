import './workspace.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/IAppStateService';
import { AppStateService } from '../../services/impl/AppStateService';
import { ZoomLevel } from '../../models/ZoomLevel';
import { Size } from '../../models/Size';
import { IRandomIdGenerator } from '../../services/IRandomIdGenerator';
import { RandomIdGenerator } from '../../services/impl/RandomIdGenerator';

export interface IWorkspaceHRulerProps {
  appStateService?: IAppStateService;
  randomIdGenerator?: IRandomIdGenerator;
}

export interface IWorkspaceHRulerState {
  color: string;
  gridSize: number;
  rulerWidth: number;
  whiteboardWidth: number;
  zoomLevel: ZoomLevel;
}

export default class WorkspaceHRuler extends React.Component<IWorkspaceHRulerProps, IWorkspaceHRulerState> {
  private container: HTMLElement;
  private ruler: HTMLElement;
  private randomIdGenerator: IRandomIdGenerator;

  constructor(props: IWorkspaceHRulerProps) {
    super(props);
    const appStateService = props.appStateService ? props.appStateService : AppStateService.getInstance();
    this.randomIdGenerator = props.randomIdGenerator ? props.randomIdGenerator : RandomIdGenerator.getInstance();
    this.state = {
      color: appStateService.getRulerColor(),
      gridSize: appStateService.getGridSize(),
      rulerWidth: 20,
      whiteboardWidth: appStateService.getWhiteboardSize().width,
      zoomLevel: appStateService.getZoomLevel(),
    };
  }

  public render() {
    const ruleLinesNb = Math.floor(this.state.whiteboardWidth / 10);
    const zoomedGridSize = this.state.zoomLevel.getZoomedValue(this.state.gridSize);
    const zoomedWhiteboardWidth = this.state.zoomLevel.getZoomedValue(this.state.whiteboardWidth);
    const components = [];
    for (let i = 0; i <= ruleLinesNb; i++) {
      if (i % 5 == 0) {
        if (i % 10 == 0) {
          components.push(
            <path
              key={this.randomIdGenerator.generate()}
              d={this.getVerticalLinePath(i, 12, zoomedGridSize, this.state.rulerWidth)}
              stroke={this.state.color}
            />
          );
          components.push(
            <text
              key={this.randomIdGenerator.generate()}
              x={i * zoomedGridSize - this.getRulerTextMargin(i * this.state.gridSize)}
              y='10'
              fontSize='9'
              fontFamily='sans-serif'
              fill={this.state.color}
            >
              {i * this.state.gridSize}
            </text>
          );
        } else {
          components.push(
            <path
              key={this.randomIdGenerator.generate()}
              d={this.getVerticalLinePath(i, 10, zoomedGridSize, this.state.rulerWidth)}
              stroke={this.state.color}
            />
          );
        }
      } else {
        components.push(
          <path
            key={this.randomIdGenerator.generate()}
            d={this.getVerticalLinePath(i, 15, zoomedGridSize, this.state.rulerWidth)}
            stroke={this.state.color}
          />
        );
      }
    }

    return (
      <div ref={(ref) => (this.container = ref)} className='horizontal-ruler-container'>
        <div className='horizontal-ruler-background'>
          <div ref={(ref) => (this.ruler = ref)} className='horizontal-ruler'>
            <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
              {components}
              <path d={this.getBottomLinePath(zoomedWhiteboardWidth, this.state.rulerWidth)} stroke={this.state.color} />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  public containerSize(size: Size): WorkspaceHRuler {
    this.container.style.width = size.width + 'px';
    this.container.style.height = size.height + 'px';
    return this;
  }

  public width(width: number): WorkspaceHRuler {
    this.ruler.style.width = width + 'px';
    return this;
  }

  public marginLeft(x: number): WorkspaceHRuler {
    this.ruler.style.marginLeft = x + 'px';
    return this;
  }

  public zoomLevel(zoomLevel: ZoomLevel): WorkspaceHRuler {
    this.setState({ zoomLevel });
    return this;
  }

  private getRulerTextMargin(nb: number): number {
    return nb.toString().length * 3 - 1;
  }

  private getBottomLinePath(whiteboardWidth: number, rulerWidth: number) {
    return `M 0 ${rulerWidth} H ${whiteboardWidth}`;
  }

  private getVerticalLinePath(i: number, height: number, gridSize: number, rulerWidth: number) {
    return `M ${i * gridSize} ${height} V ${rulerWidth}`;
  }
}
