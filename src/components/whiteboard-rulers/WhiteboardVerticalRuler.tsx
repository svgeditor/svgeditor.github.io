import './whiteboard-rulers.scss';
import * as React from 'react';

export interface IWhiteboardVerticalRulerProps {}

export interface IWhiteboardVerticalRulerState {}

export default class WhiteboardVerticalRuler extends React.Component<IWhiteboardVerticalRulerProps, IWhiteboardVerticalRulerState> {
  constructor(props: IWhiteboardVerticalRulerProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div className='whiteboard-vertical-ruler-container whiteboard-ruler-container'></div>;
  }
}
