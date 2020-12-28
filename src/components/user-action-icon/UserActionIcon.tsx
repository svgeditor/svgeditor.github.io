import './user-action-icon.scss';
import * as React from 'react';
import classNames from 'classnames';

export interface IUserActionIconProps {
  readonly name: string;
  readonly title: string;
  readonly disabled?: boolean;
  readonly selected?: boolean;
  readonly className?: string;
  readonly rotate?: string;
  readonly onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IUserActionIconState {}

export default class UserActionIcon extends React.Component<IUserActionIconProps, IUserActionIconState> {
  static defaultProps = {
    disabled: false,
    selected: false,
    className: '',
    rotate: '0deg',
  };

  constructor(props: IUserActionIconProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <span title={this.props.title} className={this.getContainerClassNames()} onClick={this.onClick}>
        <span className={this.getIconClassNames()} data-icon={this.props.name} data-inline='false' data-rotate={this.props.rotate}></span>
      </span>
    );
  }

  private onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick(event);
    }
  };

  private getContainerClassNames(): string {
    return classNames('user-action-icon-container', { disabled: this.props.disabled }, { selected: this.props.selected });
  }

  private getIconClassNames(): string {
    return classNames('iconify', this.props.className);
  }
}
