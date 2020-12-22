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
    return <div className='toolbar-container'></div>;
  }
}
