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

export interface IUserActionIconState {
  containerClassNames: string;
  iconClassNames: string;
  disabled: boolean;
  selected: boolean;
}

export default class UserActionIcon extends React.Component<IUserActionIconProps, IUserActionIconState> {
  static defaultProps = {
    disabled: false,
    selected: false,
    className: '',
    rotate: '0deg',
  };

  constructor(props: IUserActionIconProps) {
    super(props);

    this.state = {
      containerClassNames: classNames('user-action-icon-container', { disabled: this.props.disabled }, { selected: this.props.selected }),
      iconClassNames: classNames('iconify', this.props.className),
      disabled: this.props.disabled,
      selected: this.props.selected,
    };
  }

  public render() {
    return (
      <span title={this.props.title} className={this.state.containerClassNames} onClick={this.onClick}>
        <span className={this.state.iconClassNames} data-icon={this.props.name} data-inline='false' data-rotate={this.props.rotate}></span>
      </span>
    );
  }

  enable() {
    const newClassNames = classNames('user-action-icon-container', { disabled: false }, { selected: this.state.selected });
    this.setState({ containerClassNames: newClassNames, disabled: false });
  }

  disable() {
    const newClassNames = classNames('user-action-icon-container', { disabled: true }, { selected: this.state.selected });
    this.setState({ containerClassNames: newClassNames, disabled: true });
  }

  select() {
    const newClassNames = classNames('user-action-icon-container', { disabled: this.state.disabled }, { selected: true });
    this.setState({ containerClassNames: newClassNames, selected: true });
  }

  unselect() {
    const newClassNames = classNames('user-action-icon-container', { disabled: this.state.disabled }, { selected: false });
    this.setState({ containerClassNames: newClassNames, selected: false });
  }

  private onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!this.state.disabled && this.props.onClick) {
      this.props.onClick(event);
    }
  };
}
