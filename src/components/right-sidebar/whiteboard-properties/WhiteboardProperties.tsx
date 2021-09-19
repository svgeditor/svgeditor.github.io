import './whiteboard-properties.scss';
import * as React from 'react';
import SidebarSection from '../../sidebar-section/SidebarSection';
import { UserActions } from '../../../models/user-actions/UserActions';
import { AddWhiteboardGrid } from '../../../models/user-actions/AddWhiteboardGrid';
import { RemoveWhiteboardGrid } from '../../../models/user-actions/RemoveWhiteboardGrid';
import { Switch } from '@mui/material';

export interface IWhiteboardPropertiesProps {}

export interface IWhiteboardPropertiesState {
  withGrid: boolean;
}

export default class WhiteboardProperties extends React.Component<IWhiteboardPropertiesProps, IWhiteboardPropertiesState> {
  constructor(props: IWhiteboardPropertiesProps) {
    super(props);

    this.state = {
      withGrid: true,
    };
  }

  public render() {
    return (
      <SidebarSection title='Whiteboard Properties' isOpen={true}>
        <div className='whiteboard-properties-container'>
          <div className='property'>
            <p className='label'>Grid</p>
            <Switch size='small' checked={this.state.withGrid} onChange={this.handleGridSwitchChangeEvent.bind(this)} />
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
}
