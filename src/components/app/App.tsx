import './app.scss';
import * as React from 'react';
import Toolbar from '../toolbar/Toolbar';
import Whiteboard from '../whiteboard/Whiteboard';
import WhiteboardSettings from '../whiteboard-settings/WhiteboardSettings';
import WhiteboardShapes from '../whiteboard-shapes/WhiteboardShapes';
import Navbar from '../navbar/Navbar';
import WhiteboardHorizontalRuler from '../whiteboard-rulers/WhiteboardHorizantalRuler';
import WhiteboardVerticalRuler from '../whiteboard-rulers/WhiteboardVerticalRuler';
import WhiteboardRulersCorner from '../whiteboard-rulers/WhiteboardRulersCorner';

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
        <WhiteboardHorizontalRuler></WhiteboardHorizontalRuler>
        <WhiteboardVerticalRuler></WhiteboardVerticalRuler>
        <WhiteboardRulersCorner></WhiteboardRulersCorner>
        <WhiteboardSettings></WhiteboardSettings>
      </div>
    );
  }
}
