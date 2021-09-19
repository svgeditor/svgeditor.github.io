import './whiteboard-properties.scss';
import * as React from 'react';
import SidebarSection from '../../sidebar-section/SidebarSection';
import { UserActions } from '../../../models/user-actions/UserActions';
import { AddWhiteboardGrid } from '../../../models/user-actions/AddWhiteboardGrid';
import { RemoveWhiteboardGrid } from '../../../models/user-actions/RemoveWhiteboardGrid';

export interface IWhiteboardPropertiesProps {}

export interface IWhiteboardPropertiesState {
  grid: boolean;
}

export default class WhiteboardProperties extends React.Component<IWhiteboardPropertiesProps, IWhiteboardPropertiesState> {
  constructor(props: IWhiteboardPropertiesProps) {
    super(props);

    this.state = {
      grid: true,
    };
  }

  public render() {
    return (
      <SidebarSection title='Whiteboard Properties' isOpen={true}>
        <div className='whiteboard-properties-container'>
          <div className='property'>
            <p className='label'>Grid</p>
            <input checked={this.state.grid} onChange={this.handleGridInputChange.bind(this)} type='checkbox' />
          </div>
        </div>
      </SidebarSection>
    );
  }

  private handleGridInputChange(event) {
    if (event?.nativeEvent?.target?.checked) {
      document.dispatchEvent(UserActions.createCustomEvent(new AddWhiteboardGrid()));
      this.setState({ grid: true });
    } else {
      document.dispatchEvent(UserActions.createCustomEvent(new RemoveWhiteboardGrid()));
      this.setState({ grid: false });
    }
  }
}
