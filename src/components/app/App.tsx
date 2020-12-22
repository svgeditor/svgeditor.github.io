import './app.scss';
import * as React from 'react';
import Toolbar from '../toolbar/Toolbar';
import Whiteboard from '../whiteboard/Whiteboard';
import WhiteboardSettings from '../whiteboard-settings/WhiteboardSettings';
import WhiteboardLayers from '../whiteboard-layers/WhiteboardLayers';
import WhiteboardPapers from '../whiteboard-papers/WhiteboardPapaers';
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
        <WhiteboardLayers></WhiteboardLayers>
        <Whiteboard></Whiteboard>
        <WhiteboardPapers></WhiteboardPapers>
        <WhiteboardSettings></WhiteboardSettings>
      </div>
    );
  }
}
