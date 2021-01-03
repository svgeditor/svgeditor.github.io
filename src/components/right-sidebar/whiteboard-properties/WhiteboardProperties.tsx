import './whiteboard-properties.scss';
import * as React from 'react';
import SidebarSection from '../../sidebar-section/SidebarSection';

export interface IWhiteboardPropertiesProps {}

export interface IWhiteboardPropertiesState {}

export default class WhiteboardProperties extends React.Component<IWhiteboardPropertiesProps, IWhiteboardPropertiesState> {
  constructor(props: IWhiteboardPropertiesProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <SidebarSection title='Whiteboard Properties' isOpen={false}></SidebarSection>;
  }
}
