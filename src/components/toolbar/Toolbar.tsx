import './toolbar.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/IAppStateService';
import { AppStateService } from '../../services/impl/AppStateService';
import UserActionIcon from '../user-action-icon/UserActionIcon';
import { UndoableUserAction } from '../../models/user-actions/IUndoableUserAction';
import { ESvgShape } from '../../models/SvgShape';
import { UserActions } from '../../models/user-actions/UserActions';
import { BringShapesToFront } from '../../models/user-actions/BringShapesToFront';
import { SendShapesToBack } from '../../models/user-actions/SendShapesToBack';
import { ZoomInWhiteboard } from '../../models/user-actions/ZoomInWhiteboard';
import { ZoomOutWhiteboard } from '../../models/user-actions/ZoomOutWhiteboard';
import { SvgShape } from '../../models/SvgShape';
import { USER_ACTION_EVENT_NAME } from '../../constants/constants';
import { DeleteShapes } from '../../models/user-actions/DeleteShapes';
import { IUserAction } from '../../models/user-actions/IUserAction';
import { SelectShapes } from '../../models/user-actions/SelectShapes';
import { UnselectAllShapes } from '../../models/user-actions/UnselectAllShapes';
import { Shape } from '@svgdotjs/svg.js';
import { SelectAllShapes } from '../../models/user-actions/SelectAllShapes';

export interface IToolbarProps {
  appStateService?: IAppStateService;
}

export interface IToolbarState {
  shapeToDraw: ESvgShape;
  undoableUserActions: UndoableUserAction[];
  lastUndoableAction: UndoableUserAction;
  selectedShapes: SvgShape<Shape>[];
}

const A_KEY_CODE = 65;
const Z_KEY_CODE = 90;
const Y_KEY_CODE = 89;
const DELETE_KEY_CODE = 46;

export default class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
  private appStateService: IAppStateService;

  constructor(props: IToolbarProps) {
    super(props);
    this.appStateService = this.props.appStateService ? this.props.appStateService : AppStateService.getInstance();

    this.state = {
      shapeToDraw: this.appStateService.getShapeToDraw(),
      undoableUserActions: [],
      lastUndoableAction: null,
      selectedShapes: [],
    };
  }

  public render() {
    return (
      <div className='toolbar-container'>
        <UserActionIcon
          name='mdi:cursor-default-outline'
          selected={this.state.shapeToDraw == null}
          title='Select'
          onClick={() => this.changeShapeToDraw(null)}
        ></UserActionIcon>
        <UserActionIcon
          name='bx:bx-rectangle'
          title='Rectangle'
          selected={this.state.shapeToDraw == ESvgShape.RECTANGLE}
          onClick={() => this.changeShapeToDraw(ESvgShape.RECTANGLE)}
        ></UserActionIcon>
        <UserActionIcon
          name='bx:bx-circle'
          title='Circle'
          selected={this.state.shapeToDraw == ESvgShape.CIRCLE}
          onClick={() => this.changeShapeToDraw(ESvgShape.CIRCLE)}
        ></UserActionIcon>
        <UserActionIcon
          name='mdi:ellipse-outline'
          title='Ellipse'
          selected={this.state.shapeToDraw == ESvgShape.ELLIPSE}
          onClick={() => this.changeShapeToDraw(ESvgShape.ELLIPSE)}
        ></UserActionIcon>
        <UserActionIcon
          name='la:slash'
          title='Line'
          selected={this.state.shapeToDraw == ESvgShape.LINE}
          onClick={() => this.changeShapeToDraw(ESvgShape.LINE)}
        ></UserActionIcon>
        <span className='icons-separator'></span>
        <UserActionIcon
          name='ic:round-undo'
          title='Undo (Ctrl + Z)'
          disabled={this.state.undoableUserActions.length == 0}
          onClick={this.handleUndoEvent.bind(this)}
        ></UserActionIcon>
        <UserActionIcon
          name='ic:round-redo'
          title='Redo (Ctrl + Y)'
          disabled={this.state.lastUndoableAction == null}
          onClick={this.handleRedoEvent.bind(this)}
        ></UserActionIcon>
        <span className='icons-separator'></span>
        <UserActionIcon name='heroicons-outline:zoom-in' title='Zoom In' onClick={this.handleZoomIn.bind(this)}></UserActionIcon>
        <UserActionIcon name='heroicons-outline:zoom-out' title='Zoom Out' onClick={this.handleZoomOut.bind(this)}></UserActionIcon>
        <span className='icons-separator'></span>
        <UserActionIcon
          name='whh:bringtofront'
          title='Bring to front'
          className='bring-to-front-icon'
          disabled={this.state.selectedShapes.length == 0}
          onClick={this.handleBringToFrontEvent.bind(this)}
        ></UserActionIcon>
        <UserActionIcon
          name='ri:send-to-back'
          title='Send to back'
          className='send-to-back-icon'
          disabled={this.state.selectedShapes.length == 0}
          onClick={this.handleSendToBackEvent.bind(this)}
        ></UserActionIcon>
        <span className='icons-separator'></span>
        <UserActionIcon
          name='ic:twotone-delete-outline'
          title='Delete'
          disabled={this.state.selectedShapes.length == 0}
          onClick={this.handleDeleteEvent.bind(this)}
        ></UserActionIcon>
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydownEvent.bind(this));
    document.addEventListener(USER_ACTION_EVENT_NAME, this.handleUserActionEvent.bind(this));
  }

  private changeShapeToDraw(selectedShapeToDraw: ESvgShape): void {
    this.setState({ shapeToDraw: selectedShapeToDraw });
    this.appStateService.setShapeToDraw(selectedShapeToDraw);
  }

  private handleKeydownEvent(event: KeyboardEvent) {
    if (event.keyCode == Z_KEY_CODE && event.ctrlKey) {
      return this.handleUndoEvent();
    }
    if (event.keyCode == Y_KEY_CODE && event.ctrlKey) {
      return this.handleRedoEvent();
    }
    if (event.keyCode == DELETE_KEY_CODE && this.state.selectedShapes) {
      return document.dispatchEvent(UserActions.createCustomEvent(new DeleteShapes(this.state.selectedShapes)));
    }
    if (event.keyCode == A_KEY_CODE && event.ctrlKey) {
      event.preventDefault();
      return document.dispatchEvent(UserActions.createCustomEvent(new SelectAllShapes()));
    }
  }

  private handleUndoEvent() {
    if (this.state.undoableUserActions.length > 0) {
      const lastUndoableAction = this.state.undoableUserActions.pop();
      lastUndoableAction.undo();
      this.setState({ undoableUserActions: [...this.state.undoableUserActions], lastUndoableAction: lastUndoableAction });
    }
  }

  private handleRedoEvent() {
    if (this.state.lastUndoableAction) {
      this.state.lastUndoableAction.redo();
      this.setState({ undoableUserActions: [...this.state.undoableUserActions, this.state.lastUndoableAction], lastUndoableAction: null });
    }
  }

  private handleBringToFrontEvent() {
    if (this.state.selectedShapes) {
      document.dispatchEvent(UserActions.createCustomEvent(new BringShapesToFront(this.state.selectedShapes)));
    }
  }

  private handleSendToBackEvent() {
    if (this.state.selectedShapes) {
      document.dispatchEvent(UserActions.createCustomEvent(new SendShapesToBack(this.state.selectedShapes)));
    }
  }

  private handleZoomIn() {
    document.dispatchEvent(UserActions.createCustomEvent(new ZoomInWhiteboard()));
  }

  private handleZoomOut() {
    document.dispatchEvent(UserActions.createCustomEvent(new ZoomOutWhiteboard()));
  }

  private handleDeleteEvent(): void {
    if (this.state.selectedShapes) {
      document.dispatchEvent(UserActions.createCustomEvent(new DeleteShapes(this.state.selectedShapes)));
    }
  }

  private handleUserActionEvent(event: CustomEvent<IUserAction>): void {
    const userAction: IUserAction = event.detail;
    switch (true) {
      case userAction instanceof UndoableUserAction:
        this.setState({ undoableUserActions: [...this.state.undoableUserActions, userAction as UndoableUserAction] });
        return;
      case userAction instanceof SelectShapes:
        this.setState({ selectedShapes: [...(userAction as SelectShapes).shapes] });
        return;
      case userAction instanceof UnselectAllShapes:
        this.setState({ selectedShapes: [] });
        return;
      default:
      // no thing to do here!
    }
  }
}
