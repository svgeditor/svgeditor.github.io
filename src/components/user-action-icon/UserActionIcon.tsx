import './user-action-icon.scss';
import * as React from 'react';
import classNames from 'classnames';

export interface IUserActionIconProps {
  readonly name: string;
  readonly title: string;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IUserActionIconState {
  containerClassNames: string;
  iconClassNames: string;
  disabled: boolean;
}

export default class UserActionIcon extends React.Component<IUserActionIconProps, IUserActionIconState> {
  static defaultProps = {
    disabled: false,
    className: '',
  };

  constructor(props: IUserActionIconProps) {
    super(props);

    this.state = {
      containerClassNames: classNames('user-action-icon-container', { disabled: this.props.disabled }),
      iconClassNames: classNames('iconify', this.props.className),
      disabled: this.props.disabled,
    };
  }

  public render() {
    return (
      <span title={this.props.title} className={this.state.containerClassNames} onClick={this.onClick}>
        <span className={this.state.iconClassNames} data-icon={this.props.name} data-inline='false'></span>
      </span>
    );
  }

  enable() {
    const newClassNames = classNames('user-action-icon-container', { disabled: false });
    this.setState({ containerClassNames: newClassNames, disabled: false });
  }

  disable() {
    const newClassNames = classNames('user-action-icon-container', { disabled: true });
    this.setState({ containerClassNames: newClassNames, disabled: true });
  }

  private onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!this.state.disabled && this.props.onClick) {
      this.props.onClick(event);
    }
  };
}
