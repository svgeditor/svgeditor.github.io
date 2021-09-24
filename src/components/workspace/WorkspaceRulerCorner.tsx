import './workspace.scss';
import * as React from 'react';
import { Size } from '../../models/Size';

export interface IWorkspaceRulerCornerProps {}

export interface IWorkspaceRulerCornerState {}

export default class WorkspaceRulerCorner extends React.Component<IWorkspaceRulerCornerProps, IWorkspaceRulerCornerState> {
  private container: HTMLElement;

  constructor(props: IWorkspaceRulerCornerProps) {
    super(props);
  }

  public render() {
    return (
      <div ref={(ref) => (this.container = ref)} className='ruler-corner-container'>
        <div className='ruler-corner'></div>
      </div>
    );
  }

  public containerSize(size: Size) {
    this.container.style.width = size.width + 'px';
    this.container.style.height = size.height + 'px';
  }
}
