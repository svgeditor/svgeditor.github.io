import './whiteboard-papers.scss';
import * as React from 'react';

export interface IWhiteboardPapersProps {}

export interface IWhiteboardPapersState {}

export default class WhiteboardPapers extends React.Component<IWhiteboardPapersProps, IWhiteboardPapersState> {
  constructor(props: IWhiteboardPapersProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div className='whiteboard-papers-container'></div>;
  }
}
