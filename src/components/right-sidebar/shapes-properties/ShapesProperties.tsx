import './shapes-properties.scss';
import * as React from 'react';
import SidebarSection from '../../sidebar-section/SidebarSection';

export interface IShapesPropertiesProps {}

export interface IShapesPropertiesState {}

export default class ShapesProperties extends React.Component<IShapesPropertiesProps, IShapesPropertiesState> {
  constructor(props: IShapesPropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <SidebarSection title='Shapes Properties' withBorderTop={true}></SidebarSection>;
  }
}
