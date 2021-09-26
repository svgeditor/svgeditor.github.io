import './whiteboard-properties.scss';
import * as React from 'react';
import SidebarSection from '../../sidebar-section/SidebarSection';
import { UserActions } from '../../../models/user-actions/UserActions';
import { AddWhiteboardGrid } from '../../../models/user-actions/AddWhiteboardGrid';
import { RemoveWhiteboardGrid } from '../../../models/user-actions/RemoveWhiteboardGrid';
import { Switch } from '@mui/material';
import ColorPicker from '../../color-picker/ColorPicker';
import { Color } from '../../../models/Color';
import { AppState } from '../../../models/app-state/AppState';

export interface IWhiteboardPropertiesProps {
  appState?: AppState;
}

export interface IWhiteboardPropertiesState {
  withGrid: boolean;
  whiteboardBackgroundColor: Color;
  displayWhiteboardBackgroundColorPicker: boolean;
}

export default class WhiteboardProperties extends React.Component<IWhiteboardPropertiesProps, IWhiteboardPropertiesState> {
  private appState: AppState;

  constructor(props: IWhiteboardPropertiesProps) {
    super(props);
    this.state = {
      withGrid: true,
      whiteboardBackgroundColor: new Color(255, 255, 255),
      displayWhiteboardBackgroundColorPicker: false,
    };
    this.appState = this.props.appState ? this.props.appState : AppState.getInstance();
  }

  public render() {
    return (
      <SidebarSection title='Whiteboard Properties' isOpen={true}>
        <div className='whiteboard-properties-container'>
          <div className='property'>
            <p className='label'>Grid</p>
            <Switch size='small' checked={this.state.withGrid} onChange={this.handleGridSwitchChangeEvent.bind(this)} />
          </div>
          <div className='property'>
            <p className='label'>Background Color</p>
            <ColorPicker color={this.state.whiteboardBackgroundColor} onChange={this.handleChangeWhiteboardBackgroundColor.bind(this)} />
          </div>
        </div>
      </SidebarSection>
    );
  }

  private handleGridSwitchChangeEvent(event) {
    if (event?.nativeEvent?.target?.checked) {
      document.dispatchEvent(UserActions.createCustomEvent(new AddWhiteboardGrid()));
      this.setState({ withGrid: true });
    } else {
      document.dispatchEvent(UserActions.createCustomEvent(new RemoveWhiteboardGrid()));
      this.setState({ withGrid: false });
    }
  }

  private handleChangeWhiteboardBackgroundColor(color: Color) {
    // todo - use the new whiteboard class
  }
}
