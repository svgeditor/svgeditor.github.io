import './rectangle-properties.scss';
import * as React from 'react';

export interface IRectanglePropertiesProps {}

export interface IRectanglePropertiesState {}

export default class RectangleProperties extends React.Component<IRectanglePropertiesProps, IRectanglePropertiesState> {
  constructor(props: IRectanglePropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div>
        <h2 className='sidebar-title'>Rectangle Properties</h2>
        <div className='sidebar-body'></div>
      </div>
    );
  }
}
