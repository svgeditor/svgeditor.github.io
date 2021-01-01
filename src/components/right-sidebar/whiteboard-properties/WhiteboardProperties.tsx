import './whiteboard-properties.scss';
import * as React from 'react';

export interface IWhiteboardPropertiesProps {}

export interface IWhiteboardPropertiesState {}

export default class WhiteboardProperties extends React.Component<IWhiteboardPropertiesProps, IWhiteboardPropertiesState> {
  constructor(props: IWhiteboardPropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div>
        <h2 className='sidebar-title'>Whiteboard Properties</h2>
        <div className='sidebar-body'></div>
      </div>
    );
  }
}
