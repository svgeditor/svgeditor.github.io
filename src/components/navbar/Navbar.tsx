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
        <div className='navbar-left-container'>
          <img className='website-logo' src='/logo.png'></img>
          <span className='website-name'>SVG Editor</span>
          <span className='nav-item'>File</span>
          <span className='nav-item'>Edit</span>
          <span className='nav-item'>View</span>
          <span className='nav-item'>Help</span>
        </div>
        <div className='navbar-right-container'>
          <span>We are constantly working on adding new features to the website</span>
          <span>
            Please feel free to tell us which feature you want to see first by adding new{' '}
            <a target='_blank' href='https://github.com/svgeditor/svgeditor.github.io/issues'>
              ticket
            </a>{' '}
            on our github repo
          </span>
        </div>
      </div>
    );
  }
}
