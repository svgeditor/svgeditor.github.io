import './toolbar.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/api/IAppStateService';
import { AppStateService } from '../../services/impl/AppStateService';
import UserActionIcon from '../user-action-icon/UserActionIcon';
import { UndoableUserAction } from '../../models/user-actions/IUndoableUserAction';
import { ESvgElement } from '../../models/SvgElement';
import { UserActions } from '../../models/user-actions/UserActions';
import { BringShapeToFront } from '../../models/user-actions/BringShapeToFront';
import { SendShapeToBack } from '../../models/user-actions/SendShapeToBack';
import { ZoomInWhiteboard } from '../../models/user-actions/ZoomInWhiteboard';
import { ZoomOutWhiteboard } from '../../models/user-actions/ZoomOutWhiteboard';
import { SvgElement } from '../../models/SvgElement';
import { USER_ACTION_EVENT_NAME } from '../../constants/constants';
import { DeleteShape } from '../../models/user-actions/DeleteShape';
import { IUserAction } from '../../models/user-actions/IUserAction';
import { SelectShape } from '../../models/user-actions/SelectShape';
import { UnselectAllShapes } from '../../models/user-actions/UnselectAllShapes';
import { Shape } from '@svgdotjs/svg.js';

export interface IToolbarProps {
  appStateService?: IAppStateService;
}

export interface IToolbarState {
  shapeToDraw: ESvgElement;
  undoableUserActions: UndoableUserAction[];
  lastUndoableAction: UndoableUserAction;
  selectedShape: SvgElement<Shape>;
}

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
      selectedShape: null,
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
          selected={this.state.shapeToDraw == ESvgElement.RECTANGLE}
          onClick={() => this.changeShapeToDraw(ESvgElement.RECTANGLE)}
        ></UserActionIcon>
        <UserActionIcon
          name='bx:bx-circle'
          title='Circle'
          selected={this.state.shapeToDraw == ESvgElement.CIRCLE}
          onClick={() => this.changeShapeToDraw(ESvgElement.CIRCLE)}
        ></UserActionIcon>
        <UserActionIcon
          name='mdi:ellipse-outline'
          title='Ellipse'
          selected={this.state.shapeToDraw == ESvgElement.ELLIPSE}
          onClick={() => this.changeShapeToDraw(ESvgElement.ELLIPSE)}
        ></UserActionIcon>
        <UserActionIcon
          name='la:slash'
          title='Line'
          selected={this.state.shapeToDraw == ESvgElement.LINE}
          onClick={() => this.changeShapeToDraw(ESvgElement.LINE)}
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
          disabled={this.state.selectedShape === null}
          onClick={this.handleBringToFrontEvent.bind(this)}
        ></UserActionIcon>
        <UserActionIcon
          name='ri:send-to-back'
          title='Send to back'
          className='send-to-back-icon'
          disabled={this.state.selectedShape === null}
          onClick={this.handleSendToBackEvent.bind(this)}
        ></UserActionIcon>
        <span className='icons-separator'></span>
        <UserActionIcon
          name='ic:twotone-delete-outline'
          title='Delete'
          disabled={this.state.selectedShape === null}
          onClick={this.handleDeleteEvent.bind(this)}
        ></UserActionIcon>
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydownEvent.bind(this));
    document.addEventListener(USER_ACTION_EVENT_NAME, this.handleUserActionEvent.bind(this));
  }

  private changeShapeToDraw(selectedShapeToDraw: ESvgElement): void {
    this.setState({ shapeToDraw: selectedShapeToDraw });
    this.appStateService.setShapeToDraw(selectedShapeToDraw);
  }

  private handleKeydownEvent(event: KeyboardEvent) {
    if (event.keyCode == Z_KEY_CODE && event.ctrlKey) {
      this.handleUndoEvent();
    }
    if (event.keyCode == Y_KEY_CODE && event.ctrlKey) {
      this.handleRedoEvent();
    }
    if (event.keyCode == DELETE_KEY_CODE && this.state.selectedShape) {
      document.dispatchEvent(UserActions.createCustomEvent(new DeleteShape(this.state.selectedShape)));
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
    if (this.state.selectedShape) {
      document.dispatchEvent(UserActions.createCustomEvent(new BringShapeToFront(this.state.selectedShape)));
    }
  }

  private handleSendToBackEvent() {
    if (this.state.selectedShape) {
      document.dispatchEvent(UserActions.createCustomEvent(new SendShapeToBack(this.state.selectedShape)));
    }
  }

  private handleZoomIn() {
    document.dispatchEvent(UserActions.createCustomEvent(new ZoomInWhiteboard()));
  }

  private handleZoomOut() {
    document.dispatchEvent(UserActions.createCustomEvent(new ZoomOutWhiteboard()));
  }

  private handleDeleteEvent(): void {
    if (this.state.selectedShape) {
      document.dispatchEvent(UserActions.createCustomEvent(new DeleteShape(this.state.selectedShape)));
    }
  }

  private handleUserActionEvent(event: CustomEvent<IUserAction>): void {
    const userAction: IUserAction = event.detail;
    switch (true) {
      case userAction instanceof UndoableUserAction:
        this.setState({ undoableUserActions: [...this.state.undoableUserActions, userAction as UndoableUserAction] });
        return;
      case userAction instanceof SelectShape:
        this.setState({ selectedShape: (userAction as SelectShape).shape });
        return;
      case userAction instanceof UnselectAllShapes:
        this.setState({ selectedShape: null });
        return;
      default:
      // no thing to do here!
    }
  }
}
