import './app.scss';
import * as React from 'react';
import Whiteboard from '../../deprecated/Whiteboard';
import LeftSidebar from '../left-sidebar/LeftSidebar';
import RightSidebar from '../right-sidebar/RightSidebar';
import Navbar from '../navbar/Navbar';
import LeftAds from '../ads/LeftAds';
import RightAds from '../ads/RightAds';
import Workspace from '../workspace/Workspace';

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
        <LeftSidebar></LeftSidebar>
        <LeftAds></LeftAds>
        <Workspace></Workspace>
        <RightSidebar></RightSidebar>
        <RightAds></RightAds>
      </div>
    );
  }
}
