import './app.scss';
import * as React from 'react';
import Whiteboard from '../whiteboard/Whiteboard';
import LeftSidebar from '../left-sidebar/LeftSidebar';
import RightSidebar from '../right-sidebar/RightSidebar';
import Navbar from '../navbar/Navbar';
import LeftAds from '../ads/LeftAds';
import RightAds from '../ads/RightAds';

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
        <Whiteboard></Whiteboard>
        <RightSidebar></RightSidebar>
        <RightAds></RightAds>
      </div>
    );
  }
}
