import './workspace.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/IAppStateService';
import { AppStateService } from '../../services/impl/AppStateService';
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

export interface IWorkspaceProps {
  appStateService?: IAppStateService;
}

export interface IWorkspaceState {}

export default class Workspace extends React.Component<IWorkspaceProps, IWorkspaceState> {
  private appStateService: IAppStateService;
  private window: WorkspaceWindow;
  private background: WorkspaceBackground;
  private grid: WorkspaceGrid;
  private whiteboard: WorkspaceWhiteboard;
  private hRuler: WorkspaceHRuler;
  private vRuler: WorkspaceVRuler;
  private rulerCorner: WorkspaceRulerCorner;

  constructor(props: IWorkspaceProps) {
    super(props);
    this.appStateService = props.appStateService ? props.appStateService : AppStateService.getInstance();
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
    this.window.center(this.whiteboard);
    document.addEventListener(USER_ACTION_EVENT_NAME, this.handleUserActionEvent.bind(this));
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

  private zoomIn(): void {
    this.resize();
  }

  private zoomOut(): void {
    this.resize();
  }

  private resize() {
    const windowSize = this.window.getSize();
    const zoomLevel = this.appStateService.getZoomLevel();
    const whiteboardSize = this.appStateService.getWhiteboardSize(true);
    const backgroundWidth = windowSize.width * 2 + whiteboardSize.width - WORKSPACE_MARGIN;
    const backgroundHeight = windowSize.height * 2 + whiteboardSize.height - WORKSPACE_MARGIN;
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
