import './circle-properties.scss';
import * as React from 'react';

export interface ICirclePropertiesProps {}

export interface ICirclePropertiesState {}

export default class CircleProperties extends React.Component<ICirclePropertiesProps, ICirclePropertiesState> {
  constructor(props: ICirclePropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div>
        <h2 className='sidebar-title'>Circle Properties</h2>
        <div className='sidebar-body'></div>
      </div>
    );
  }
}
