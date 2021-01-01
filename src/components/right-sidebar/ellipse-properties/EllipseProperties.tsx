import './ellipse-properties.scss';
import * as React from 'react';

export interface IEllipsePropertiesProps {}

export interface IEllipsePropertiesState {}

export default class EllipseProperties extends React.Component<IEllipsePropertiesProps, IEllipsePropertiesState> {
  constructor(props: IEllipsePropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div>
        <h2 className='sidebar-title'>Ellipse Properties</h2>
        <div className='sidebar-body'></div>
      </div>
    );
  }
}
