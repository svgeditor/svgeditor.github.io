import './workspace.scss';
import * as React from 'react';
import { Size } from '../../models/Size';
import { ScrollInfo } from '../../models/ScrollInfo';
import WorkspaceWhiteboard from './WorkspaceWhiteboard';
import { WORKSPACE_MARGIN } from '../../constants/constants';

export interface IWorkspaceWindowProps {
  className?: string;
}

export interface IWorkspaceWindowState {}

export default class WorkspaceWindow extends React.Component<IWorkspaceWindowProps, IWorkspaceWindowState> {
  private container: HTMLElement;

  constructor(props: IWorkspaceWindowProps) {
    super(props);
  }

  public render() {
    return (
      <div ref={(ref) => (this.container = ref)} className={this.getClassName()}>
        {this.props.children}
      </div>
    );
  }

  public getSize(): Size {
    return Size.fromDOMRect(this.container.getBoundingClientRect());
  }

  public getScrollInfo(): ScrollInfo {
    return ScrollInfo.form(this.container);
  }

  public scrollTo(x: number, y: number): void {
    this.container.scrollTo(x, y);
  }

  public center(whiteboard: WorkspaceWhiteboard): void {
    const whiteboardDimensions = whiteboard.getDimensions();
    const windowDimensions = this.getSize();
    const scrollX =
      whiteboardDimensions.width < windowDimensions.width
        ? windowDimensions.width - (windowDimensions.width - whiteboardDimensions.width) / 2 - WORKSPACE_MARGIN / 2
        : windowDimensions.width - WORKSPACE_MARGIN;
    const scrollY =
      whiteboardDimensions.height < windowDimensions.height
        ? windowDimensions.height - (windowDimensions.height - whiteboardDimensions.height) / 2 - WORKSPACE_MARGIN / 2
        : windowDimensions.height - WORKSPACE_MARGIN;
    this.scrollTo(scrollX, scrollY);
  }

  private getClassName() {
    return `${this.props.className} workspace-window`;
  }
}
