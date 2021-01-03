import './sidebar-section.scss';
import * as React from 'react';
import classNames from 'classnames';

export interface ISidebarSectionProps {
  title: string;
  isOpen?: boolean;
  withBorderTop?: boolean;
}

export interface ISidebarSectionState {
  isOpen: boolean;
}

export default class SidebarSection extends React.Component<ISidebarSectionProps, ISidebarSectionState> {
  constructor(props: ISidebarSectionProps) {
    super(props);
    this.state = {
      isOpen: this.props.isOpen !== undefined ? this.props.isOpen : true,
    };
  }

  public render() {
    const titleClassNames = classNames('sidebar-title-container', { 'with-border-top': this.props.withBorderTop });
    return (
      <div className='sidebar-section-container'>
        <div className={titleClassNames}>
          {this.state.isOpen && (
            <span className='sidebar-title-icon' onClick={() => this.setState({ isOpen: false })}>
              <span className='iconify' data-icon='fe:arrow-down' data-inline='false'></span>
            </span>
          )}
          {!this.state.isOpen && (
            <span className='sidebar-title-icon' onClick={() => this.setState({ isOpen: true })}>
              <span className='iconify' data-icon='fe:arrow-right' data-inline='false'></span>
            </span>
          )}
          <h2 className='sidebar-title'>{this.props.title}</h2>
        </div>
        {this.state.isOpen && this.props.children}
      </div>
    );
  }
}
