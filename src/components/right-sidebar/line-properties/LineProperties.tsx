import './line-properties.scss';
import * as React from 'react';
import SidebarSection from '../../sidebar-section/SidebarSection';

export interface ILinePropertiesProps {}

export interface ILinePropertiesState {}

export default class LineProperties extends React.Component<ILinePropertiesProps, ILinePropertiesState> {
  constructor(props: ILinePropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <SidebarSection title='Line Properties' withBorderTop={true}></SidebarSection>;
  }
}
