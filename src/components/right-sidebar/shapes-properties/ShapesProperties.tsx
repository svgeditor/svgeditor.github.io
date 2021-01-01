import './shapes-properties.scss';
import * as React from 'react';

export interface IShapesPropertiesProps {}

export interface IShapesPropertiesState {}

export default class ShapesProperties extends React.Component<IShapesPropertiesProps, IShapesPropertiesState> {
  constructor(props: IShapesPropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div>
        <h2 className='sidebar-title'>Shapes Properties</h2>
        <div className='sidebar-body'></div>
      </div>
    );
  }
}
