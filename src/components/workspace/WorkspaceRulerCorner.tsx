import './workspace.scss';
import * as React from 'react';

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

  public containerSize(width: number, height: number) {
    this.container.style.width = width + 'px';
    this.container.style.height = height + 'px';
  }
}
