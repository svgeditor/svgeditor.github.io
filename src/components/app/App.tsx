import './app.scss';
import * as React from 'react';
import Toolbar from '../toolbar/Toolbar';
import Whiteboard from '../whiteboard/Whiteboard';
import LeftSidebar from '../left-sidebar/LeftSidebar';
import RightSidebar from '../right-sidebar/RightSidebar';
import Navbar from '../navbar/Navbar';

export interface IAppProps {}

export interface IAppState {}

export default class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div className='app-container'>
        <Navbar></Navbar>
        <Toolbar></Toolbar>
        <RightSidebar></RightSidebar>
        <Whiteboard></Whiteboard>
        <LeftSidebar></LeftSidebar>
      </div>
    );
  }
}
