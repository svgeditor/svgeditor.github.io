import './line-properties.scss';
import * as React from 'react';

export interface ILinePropertiesProps {}

export interface ILinePropertiesState {}

export default class LineProperties extends React.Component<ILinePropertiesProps, ILinePropertiesState> {
  constructor(props: ILinePropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div>
        <h2 className='sidebar-title'>Line Properties</h2>
        <div className='sidebar-body'></div>
      </div>
    );
  }
}
