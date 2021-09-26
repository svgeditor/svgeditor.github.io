import './workspace.scss';
import * as React from 'react';
import { USER_ACTION_EVENT_NAME, WORKSPACE_MARGIN } from '../../constants/constants';
import { IUserAction } from '../../models/user-actions/IUserAction';
import { ZoomInWhiteboard } from '../../models/user-actions/ZoomInWhiteboard';
import { ZoomOutWhiteboard } from '../../models/user-actions/ZoomOutWhiteboard';
import WorkspaceGrid from './WorkspaceGrid';
import WorkspaceBackground from './WorkspaceBackground';
import WorkspaceWhiteboard from './WorkspaceWhiteboard';
import WorkspaceWindow from './WorkspaceWindow';
import WorkspaceHRuler from './WorkspaceHRuler';
import WorkspaceVRuler from './WorkspaceVRuler';
import WorkspaceRulerCorner from './WorkspaceRulerCorner';
import { Size } from '../../models/Size';
import { AppState } from '../../models/app-state/AppState';

export interface IWorkspaceProps {
  appState?: AppState;
}

export interface IWorkspaceState {}

export default class Workspace extends React.Component<IWorkspaceProps, IWorkspaceState> {
  private appState: AppState;
  private window: WorkspaceWindow;
  private background: WorkspaceBackground;
  private grid: WorkspaceGrid;
  private whiteboard: WorkspaceWhiteboard;
  private hRuler: WorkspaceHRuler;
  private vRuler: WorkspaceVRuler;
  private rulerCorner: WorkspaceRulerCorner;

  constructor(props: IWorkspaceProps) {
    super(props);
    this.appState = props.appState ? props.appState : AppState.getInstance();
  }

  public render() {
    return (
      <WorkspaceWindow ref={(ref) => (this.window = ref)} className='workspace-container'>
        <WorkspaceHRuler ref={(ref) => (this.hRuler = ref)} />
        <WorkspaceVRuler ref={(ref) => (this.vRuler = ref)} />
        <WorkspaceRulerCorner ref={(ref) => (this.rulerCorner = ref)} />
        <WorkspaceBackground ref={(ref) => (this.background = ref)}>
          <WorkspaceGrid ref={(ref) => (this.grid = ref)} />
          <WorkspaceWhiteboard ref={(ref) => (this.whiteboard = ref)} />
        </WorkspaceBackground>
      </WorkspaceWindow>
    );
  }

  componentDidMount() {
    this.resize();
    this.window.setWhiteboard(this.whiteboard).setBackground(this.background).center();
    this.window.addMouseWheelEventListener(this.handleMouseWheelEvent.bind(this));
    document.addEventListener(USER_ACTION_EVENT_NAME, this.handleUserActionEvent.bind(this));
  }

  private handleMouseWheelEvent(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        this.appState.increaseZoomLevel();
        this.zoomIn(event);
      } else {
        this.appState.decreaseZoomLevel();
        this.zoomOut(event);
      }
    }
  }

  private handleUserActionEvent(event: CustomEvent<IUserAction>) {
    const userAction: IUserAction = event.detail;
    switch (true) {
      case userAction instanceof ZoomInWhiteboard:
        return this.zoomIn();
      case userAction instanceof ZoomOutWhiteboard:
        return this.zoomOut();
      default:
      // no thing to do here!
    }
  }

  private zoomIn(event?: MouseEvent): void {
    this.resize();
    this.window.centerOnZoomIn(event);
  }

  private zoomOut(event?: MouseEvent): void {
    this.resize();
    this.window.centerOnZoomOut(event);
  }

  private resize() {
    const windowBoundingRectangle = this.window.getBoundingRectangle();
    const zoomLevel = this.appState.getZoomLevel();
    const whiteboardSize = this.appState.getWhiteboardSize(true);
    const backgroundWidth = windowBoundingRectangle.width * 2 + whiteboardSize.width - WORKSPACE_MARGIN;
    const backgroundHeight = windowBoundingRectangle.height * 2 + whiteboardSize.height - WORKSPACE_MARGIN;
    const backgroundSize = new Size(backgroundWidth, backgroundHeight);
    const whiteboardX = (backgroundWidth - whiteboardSize.width) / 2;
    const whiteboardY = (backgroundHeight - whiteboardSize.height) / 2;

    this.background.size(backgroundWidth, backgroundHeight);
    this.whiteboard.x(whiteboardX).y(whiteboardY).size(whiteboardSize);
    this.grid.x(whiteboardX).y(whiteboardY).size(whiteboardSize);
    this.hRuler.containerSize(backgroundSize).width(whiteboardSize.width).marginLeft(whiteboardX).zoomLevel(zoomLevel);
    this.vRuler.containerSize(backgroundSize).height(whiteboardSize.height).marginTop(whiteboardY).zoomLevel(zoomLevel);
    this.rulerCorner.containerSize(backgroundSize);
  }
}
