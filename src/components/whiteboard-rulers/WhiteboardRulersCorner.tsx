import './whiteboard-rulers.scss';
import * as React from 'react';

export interface IWhiteboardRulersCornerProps {}

export interface IWhiteboardRulersCornerState {}

export default class WhiteboardRulersCorner extends React.Component<IWhiteboardRulersCornerProps, IWhiteboardRulersCornerState> {
  constructor(props: IWhiteboardRulersCornerProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div className='whiteboard-rulers-corner-container'></div>;
  }
}
