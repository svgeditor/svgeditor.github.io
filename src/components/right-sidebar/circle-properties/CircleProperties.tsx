import './circle-properties.scss';
import * as React from 'react';
import SidebarSection from '../../sidebar-section/SidebarSection';

export interface ICirclePropertiesProps {}

export interface ICirclePropertiesState {}

export default class CircleProperties extends React.Component<ICirclePropertiesProps, ICirclePropertiesState> {
  constructor(props: ICirclePropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <SidebarSection title='Circle Properties' withBorderTop={true}></SidebarSection>;
  }
}
