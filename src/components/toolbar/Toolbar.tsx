import './toolbar.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/api/IAppStateService';
import { AppStateService } from '../../services/impl/AppStateService';
import UserActionIcon from '../user-action-icon/UserActionIcon';
import {
  DELETE_SELECTED_SHAPES_EVENT,
  NEW_UNDOABLE_ACTION_EVENT_NAME,
  SELECTED_SHAPES_DELETED_EVENT_NAME,
  SELECT_SHAPE_EVENT_NAME,
  UNSELECT_ALL_SHAPES_EVENT_NAME,
  ZOOM_IN_EVENT,
  ZOOM_OUT_EVENT,
} from '../../models/CustomEvents';
import { IUndoableAction } from '../../models/UndoableAction';

export interface IToolbarProps {
  appStateService?: IAppStateService;
}

export interface IToolbarState {}

const Z_KEY_CODE = 90;
const Y_KEY_CODE = 89;

export default class Toolbar extends React.Component<IToolbarProps, IToolbarState> {
  private appStateService: IAppStateService;
  private undoIcon: UserActionIcon;
  private redoIcon: UserActionIcon;
  private zoomInIcon: UserActionIcon;
  private zoomOutIcon: UserActionIcon;
  private deleteIcon: UserActionIcon;
  private bringShapeToFrontIcon: UserActionIcon;
  private sendShapeToBackIcon: UserActionIcon;
  private fillColorIcon: UserActionIcon;
  private borderColorIcon: UserActionIcon;
  private addShadowIcon: UserActionIcon;
  private lastUndoableAction: IUndoableAction;

  constructor(props: IToolbarProps) {
    super(props);
    this.appStateService = this.props.appStateService ? this.props.appStateService : AppStateService.getInstance();

    this.state = {};
  }

  public render() {
    return (
      <div className='toolbar-container'>
        <UserActionIcon
          ref={(ref) => (this.undoIcon = ref)}
          name='ic:round-undo'
          title='Undo (Ctrl + Z)'
          disabled={true}
          onClick={this.handleUndoEvent.bind(this)}
        ></UserActionIcon>
        <UserActionIcon
          ref={(ref) => (this.redoIcon = ref)}
          name='ic:round-redo'
          title='Redo'
          disabled={true}
          onClick={this.handleRedoEvent.bind(this)}
        ></UserActionIcon>
        <span className='icons-separator'></span>
        <UserActionIcon
          ref={(ref) => (this.zoomInIcon = ref)}
          name='heroicons-outline:zoom-in'
          title='Zoom In'
          onClick={this.handleZoomIn.bind(this)}
        ></UserActionIcon>
        <UserActionIcon
          ref={(ref) => (this.zoomOutIcon = ref)}
          name='heroicons-outline:zoom-out'
          title='Zoom Out'
          onClick={this.handleZoomOut.bind(this)}
        ></UserActionIcon>
        <span className='icons-separator'></span>
        <UserActionIcon
          ref={(ref) => (this.deleteIcon = ref)}
          name='ic:twotone-delete-outline'
          title='Delete'
          disabled={true}
          onClick={this.handleDeleteEvent.bind(this)}
        ></UserActionIcon>
        <span className='icons-separator'></span>
        <UserActionIcon
          ref={(ref) => (this.bringShapeToFrontIcon = ref)}
          name='whh:bringtofront'
          title='Bring shape to front'
          className='bring-to-front-icon'
          disabled={true}
        ></UserActionIcon>
        <UserActionIcon
          ref={(ref) => (this.sendShapeToBackIcon = ref)}
          name='ri:send-to-back'
          title='Send shape to back'
          className='send-to-back-icon'
          disabled={true}
        ></UserActionIcon>
        <span className='icons-separator'></span>
        <UserActionIcon
          ref={(ref) => (this.fillColorIcon = ref)}
          name='ic:round-format-color-fill'
          title='Fill Color'
          disabled={true}
        ></UserActionIcon>
        <UserActionIcon
          ref={(ref) => (this.borderColorIcon = ref)}
          name='ic:round-border-color'
          title='Border Color'
          disabled={true}
        ></UserActionIcon>
        <UserActionIcon
          ref={(ref) => (this.addShadowIcon = ref)}
          name='vaadin:square-shadow'
          title='Add Shadow'
          className='shadow-icon'
          disabled={true}
        ></UserActionIcon>
      </div>
    );
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydownEvent.bind(this));
    document.addEventListener(UNSELECT_ALL_SHAPES_EVENT_NAME, this.handleUnselectAllShapesEvent.bind(this));
    document.addEventListener(SELECT_SHAPE_EVENT_NAME, this.handleSelectShapeEvent.bind(this));
    document.addEventListener(NEW_UNDOABLE_ACTION_EVENT_NAME, this.handleAddUndoableActionEvent.bind(this));
    document.addEventListener(SELECTED_SHAPES_DELETED_EVENT_NAME, this.handleSelectedShapesDeletedEvent.bind(this));
  }

  private handleKeydownEvent(event: KeyboardEvent) {
    if (event.keyCode == Z_KEY_CODE && event.ctrlKey) {
      this.handleUndoEvent();
    }
    if (event.keyCode == Y_KEY_CODE && event.ctrlKey) {
      this.handleRedoEvent();
    }
  }

  private handleZoomIn() {
    document.dispatchEvent(ZOOM_IN_EVENT);
  }

  private handleZoomOut() {
    document.dispatchEvent(ZOOM_OUT_EVENT);
  }

  private handleUndoEvent() {
    if (this.appStateService.getUndoableUserActionsSize() > 0) {
      this.lastUndoableAction = this.appStateService.popUndoableUserAction().undo();
      this.redoIcon.enable();
      if (this.appStateService.getUndoableUserActionsSize() == 0) {
        this.undoIcon.disable();
      }
    }
  }

  private handleRedoEvent() {
    this.lastUndoableAction.redo();
    this.redoIcon.disable();
    this.appStateService.pushUndoableUserAction(this.lastUndoableAction);
    this.undoIcon.enable();
  }

  private handleSelectShapeEvent(): void {
    this.deleteIcon.enable();
    this.bringShapeToFrontIcon.enable();
    this.sendShapeToBackIcon.enable();
    this.fillColorIcon.enable();
    this.borderColorIcon.enable();
    this.addShadowIcon.enable();
  }

  private handleUnselectAllShapesEvent(): void {
    this.deleteIcon.disable();
    this.bringShapeToFrontIcon.disable();
    this.sendShapeToBackIcon.disable();
    this.fillColorIcon.disable();
    this.borderColorIcon.disable();
    this.addShadowIcon.disable();
  }

  private handleAddUndoableActionEvent(): void {
    this.undoIcon.enable();
  }

  private handleDeleteEvent(): void {
    document.dispatchEvent(DELETE_SELECTED_SHAPES_EVENT);
  }

  private handleSelectedShapesDeletedEvent(): void {
    this.deleteIcon.disable();
    this.bringShapeToFrontIcon.disable();
    this.sendShapeToBackIcon.disable();
    this.fillColorIcon.disable();
    this.borderColorIcon.disable();
    this.addShadowIcon.disable();
  }
}
