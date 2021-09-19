import './navbar.scss';
import * as React from 'react';
import Toolbar from '../toolbar/Toolbar';

export interface INavbarProps {}

export interface INavbarState {}

export default class Navbar extends React.Component<INavbarProps, INavbarState> {
  constructor(props: INavbarProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div className='navbar-container'>
        <div className='navbar-left'>
          <img className='website-logo' src='/logo.png'></img>
          <span className='website-name'>SVG Editor</span>
        </div>
        <div className='navbar-center'>
          <Toolbar />
        </div>
        <div className='navbar-right'></div>
      </div>
    );
  }
}
