import './whiteboard-settings.scss';
import * as React from 'react';

export interface IWhiteboardSettingsProps {}

export interface IWhiteboardSettingsState {}

export default class WhiteboardSettings extends React.Component<IWhiteboardSettingsProps, IWhiteboardSettingsState> {
  constructor(props: IWhiteboardSettingsProps) {
    super(props);

    this.state = {};
  }

  public render() {
    return (
      <div className='whiteboard-settings-container'>
        <h2>Settings</h2>
      </div>
    );
  }
}
