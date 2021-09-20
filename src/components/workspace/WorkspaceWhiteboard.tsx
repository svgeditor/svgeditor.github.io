import './workspace.scss';
import * as React from 'react';
import { Size } from '../../models/Size';

export interface IWorkspaceWhiteboardProps {}

export interface IWorkspaceWhiteboardState {}

export default class WorkspaceWhiteboard extends React.Component<IWorkspaceWhiteboardProps, IWorkspaceWhiteboardState> {
  private svg: SVGSVGElement;

  constructor(props: IWorkspaceWhiteboardProps) {
    super(props);
  }

  public render() {
    return (
      <svg ref={(ref) => (this.svg = ref)} xmlns='http://www.w3.org/2000/svg'>
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
    this.svg.setAttribute('height', size.height + '');
    this.svg.setAttribute('width', size.width + '');
    return this;
  }

  public getDimensions(): Size {
    return new Size(parseInt(this.svg.getAttribute('width')), parseInt(this.svg.getAttribute('height')));
  }
}
