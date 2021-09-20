import './workspace.scss';
import * as React from 'react';
import { Size } from '../../models/Size';

export interface IWorkspaceBackgroundProps {}

export interface IWorkspaceBackgroundState {}

export default class WorkspaceBackground extends React.Component<IWorkspaceBackgroundProps, IWorkspaceBackgroundState> {
  private container: HTMLElement;

  constructor(props: IWorkspaceBackgroundProps) {
    super(props);
  }

  public render() {
    return (
      <div ref={(ref) => (this.container = ref)} className='workspace-background'>
        <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
          {this.props.children}
        </svg>
      </div>
    );
  }

  public size(width: number, height: number) {
    this.container.style.width = width + 'px';
    this.container.style.height = height + 'px';
  }

  public getDimensions(): Size {
    return Size.fromDOMRect(this.container.getBoundingClientRect());
  }
}
