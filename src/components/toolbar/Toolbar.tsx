import './toolbar.scss';
import * as React from 'react';

export interface IToolbarProps {}

export interface IToolbarState {}

export default class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
  constructor(props: IToolbarProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div className='toolbar-container'>
        <span className='iconify' data-icon='ic:round-undo' data-inline='false'></span>
        <span className='iconify' data-icon='ic:round-redo' data-inline='false'></span>
        <span className='iconify line-separator' data-icon='ant-design:line-outlined' data-inline='false' data-rotate='90deg'></span>
        <span className='iconify' data-icon='heroicons-outline:zoom-in' data-inline='false'></span>
        <span className='iconify' data-icon='heroicons-outline:zoom-out' data-inline='false'></span>
        <span className='iconify line-separator' data-icon='ant-design:line-outlined' data-inline='false' data-rotate='90deg'></span>
        <span className='iconify' data-icon='ic:twotone-delete-outline' data-inline='false'></span>
        <span className='iconify line-separator' data-icon='ant-design:line-outlined' data-inline='false' data-rotate='90deg'></span>
        <span className='iconify to-front-icon' data-icon='whh:bringtofront' data-inline='false'></span>
        <span className='iconify to-back-icon' data-icon='ri:send-to-back' data-inline='false'></span>
        <span className='iconify line-separator' data-icon='ant-design:line-outlined' data-inline='false' data-rotate='90deg'></span>
        <span className='iconify' data-icon='ic:round-format-color-fill' data-inline='false'></span>
        <span className='iconify' data-icon='ic:round-border-color' data-inline='false'></span>
        <span className='iconify shadow-icon' data-icon='vaadin:square-shadow' data-inline='false'></span>
      </div>
    );
  }
}
