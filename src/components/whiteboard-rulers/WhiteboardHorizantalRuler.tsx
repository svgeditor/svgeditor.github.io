import './whiteboard-rulers.scss';
import * as React from 'react';

export interface IWhiteboardHorizontalRulerProps {}

export interface IWhiteboardHorizontalRulerState {}

export default class WhiteboardHorizontalRuler extends React.Component<IWhiteboardHorizontalRulerProps, IWhiteboardHorizontalRulerState> {
  constructor(props: IWhiteboardHorizontalRulerProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div className='whiteboard-horizontal-ruler-container whiteboard-ruler-container'></div>;
  }
}
