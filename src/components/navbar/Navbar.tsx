import './navbar.scss';
import * as React from 'react';

export interface INavbarProps {}

export interface INavbarState {}

export default class Navbar extends React.Component<INavbarProps, INavbarState> {
  constructor(props: INavbarProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return <div className='navbar-container'></div>;
  }
}
