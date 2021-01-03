import './left-sidebar.scss';
import * as React from 'react';
import DrawnShapes from './DrawnShapes';
import ShapesToDraw from './ShapesToDraw';

export interface ILeftSidebarProps {}

export interface ILeftSidebarState {}

export default class LeftSidebar extends React.Component<ILeftSidebarProps, ILeftSidebarState> {
  constructor(props: ILeftSidebarProps) {
    super(props);
    this.state = {};
  }

  public render() {
    return (
      <div className='left-sidebar-container'>
        <ShapesToDraw></ShapesToDraw>
        <DrawnShapes></DrawnShapes>
      </div>
    );
  }
}
