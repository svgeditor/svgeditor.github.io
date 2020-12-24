import './whiteboard-shapes.scss';
import * as React from 'react';

export interface IWhiteboardShapesProps {}

export interface IWhiteboardShapesState {}

export default class WhiteboardShapes extends React.Component<IWhiteboardShapesProps, IWhiteboardShapesState> {
  constructor(props: IWhiteboardShapesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div className='whiteboard-shapes-container'></div>;
  }
}
