import './ellipse-properties.scss';
import * as React from 'react';
import SidebarSection from '../../sidebar-section/SidebarSection';

export interface IEllipsePropertiesProps {}

export interface IEllipsePropertiesState {}

export default class EllipseProperties extends React.Component<IEllipsePropertiesProps, IEllipsePropertiesState> {
  constructor(props: IEllipsePropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <SidebarSection title='Ellipse Properties' withBorderTop={true}></SidebarSection>;
  }
}
