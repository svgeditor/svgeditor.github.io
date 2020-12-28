import './left-sidebar.scss';
import * as React from 'react';

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
        <h2 className='sidebar-title'>Shapes</h2>
      </div>
    );
  }
}
