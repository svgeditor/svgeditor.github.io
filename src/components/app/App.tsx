import './app.scss';
import * as React from 'react';
import Toolbar from '../toolbar/Toolbar';
import Whiteboard from '../whiteboard/Whiteboard';
import WhiteboardSettings from '../whiteboard-settings/WhiteboardSettings';
import WhiteboardShapes from '../whiteboard-shapes/WhiteboardShapes';
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
        <WhiteboardShapes></WhiteboardShapes>
        <Whiteboard></Whiteboard>
        <WhiteboardSettings></WhiteboardSettings>
      </div>
    );
  }
}
