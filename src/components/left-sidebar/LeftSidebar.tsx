import './left-sidebar.scss';
import * as React from 'react';
import { SvgShape } from '../../models/SvgShape';
import { Shape } from '@svgdotjs/svg.js';

export interface ILeftSidebarProps {}

export interface ILeftSidebarState {
  svgElements: SvgShape<Shape>[];
}

export default class LeftSidebar extends React.Component<ILeftSidebarProps, ILeftSidebarState> {
  constructor(props: ILeftSidebarProps) {
    super(props);

    this.state = {
      svgElements: [],
    };
  }

  public render() {
    return (
      <div className='left-sidebar-container'>
        <h2 className='sidebar-title'>Shapes</h2>
      </div>
    );
  }
}
