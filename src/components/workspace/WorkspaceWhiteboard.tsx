import './workspace.scss';
import * as React from 'react';
import { Size } from '../../models/Size';
import { BoundingRectangle } from '../../models/BoundingRectangle';
import { AppState } from '../../models/app-state/AppState';
import { SvgRootElement } from '../../models/svg-elements/SvgRootElement';

export interface IWorkspaceWhiteboardProps {
  appState?: AppState;
}

export interface IWorkspaceWhiteboardState {
  width: number;
  height: number;
  viewBox: string;
}

export default class WorkspaceWhiteboard extends React.Component<IWorkspaceWhiteboardProps, IWorkspaceWhiteboardState> {
  private appState: AppState;
  private svg: SVGSVGElement;

  constructor(props: IWorkspaceWhiteboardProps) {
    super(props);
    this.appState = props.appState ? props.appState : AppState.getInstance();
    const zoomedWhiteboardSize = this.appState.getWhiteboardSize(true);
    this.state = {
      width: zoomedWhiteboardSize.width,
      height: zoomedWhiteboardSize.height,
      viewBox: `0 0 ${this.appState.getWhiteboardProps().width} ${this.appState.getWhiteboardProps().height}`,
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
        <style>{this.getStyle()}</style>
      </svg>
    );
  }

  componentDidMount() {
    this.appState.setSvgRootElement(SvgRootElement.from(this.svg));
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

  private getStyle() {
    return /* css */ `
      .svg-element {
        cursor: move;
      }

      .svg-element-hover-helper {
        pointer-events: none;
        transition: opacity 0.15s ease-in-out;
        opacity: 0;
      }

      .svg-element-group:hover .svg-element-hover-helper {
        opacity: 1;
      }
    `;
  }
}
