import './right-sidebar.scss';
import * as React from 'react';

export interface IRightSidebarProps {}

export interface IRightSidebarState {}

export default class RightSidebar extends React.Component<IRightSidebarProps, IRightSidebarState> {
  constructor(props: IRightSidebarProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div className='right-sidebar-container'>
        <h2 className='sidebar-title'>Shape Properties</h2>
      </div>
    );
  }
}
