import './whiteboard-layers.scss';
import * as React from 'react';

export interface IWhiteboardLayersProps {}

export interface IWhiteboardLayersState {}

export default class WhiteboardLayers extends React.Component<IWhiteboardLayersProps, IWhiteboardLayersState> {
  constructor(props: IWhiteboardLayersProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div className='whiteboard-layers-container'></div>;
  }
}
