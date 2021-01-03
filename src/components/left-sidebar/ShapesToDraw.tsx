import './drawn-shapes.scss';
import * as React from 'react';
import SidebarSection from '../sidebar-section/SidebarSection';

export interface IShapesToDrawProps {}

export interface IShapesToDrawState {}

export default class ShapesToDraw extends React.Component<IShapesToDrawProps, IShapesToDrawState> {
  constructor(props: IShapesToDrawProps) {
    super(props);
    this.state = {};
  }

  public render() {
    return <SidebarSection title='Shapes To Draw' isOpen={false}></SidebarSection>;
  }
}
