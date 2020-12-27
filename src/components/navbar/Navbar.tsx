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
    return (
      <div className='navbar-container'>
        <img className='website-logo' src='/logo.png'></img>
        <span className='website-name'>Draw SVG</span>
        <span className='nav-item'>File</span>
        <span className='nav-item'>Edit</span>
        <span className='nav-item'>View</span>
        <span className='nav-item'>Help</span>
      </div>
    );
  }
}
