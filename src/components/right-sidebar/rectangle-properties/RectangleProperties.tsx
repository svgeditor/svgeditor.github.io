import './rectangle-properties.scss';
import * as React from 'react';
import SidebarSection from '../../sidebar-section/SidebarSection';

export interface IRectanglePropertiesProps {}

export interface IRectanglePropertiesState {}

export default class RectangleProperties extends React.Component<IRectanglePropertiesProps, IRectanglePropertiesState> {
  constructor(props: IRectanglePropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <SidebarSection title='Rectangle Properties' withBorderTop={true}></SidebarSection>;
  }
}
