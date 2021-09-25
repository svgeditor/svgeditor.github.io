import './workspace.scss';
import * as React from 'react';
import { Size } from '../../models/Size';
import { ScrollInfo } from '../../models/ScrollInfo';
import WorkspaceWhiteboard from './WorkspaceWhiteboard';
import { WORKSPACE_MARGIN } from '../../constants/constants';
import { IAppStateService } from '../../services/IAppStateService';
import { AppStateService } from '../../services/impl/AppStateService';
import { MAX_ZOOM_PERCENTAGE, MIN_ZOOM_PERCENTAGE, ZOOM_PERCENTAGE_STEP } from '../../models/ZoomLevel';
import WorkspaceBackground from './WorkspaceBackground';

export interface IWorkspaceWindowProps {
  className?: string;
  appStateService?: IAppStateService;
}

export interface IWorkspaceWindowState {}

export default class WorkspaceWindow extends React.Component<IWorkspaceWindowProps, IWorkspaceWindowState> {
  private _container: HTMLElement;
  private _appStateService: IAppStateService;
  private _whiteboard: WorkspaceWhiteboard;
  private _background: WorkspaceBackground;

  constructor(props: IWorkspaceWindowProps) {
    super(props);
    this._appStateService = props.appStateService ? props.appStateService : AppStateService.getInstance();
  }

  public render() {
    return (
      <div ref={(ref) => (this._container = ref)} className={this.getClassName()}>
        {this.props.children}
      </div>
    );
  }

  public getSize(): Size {
    return Size.fromDOMRect(this._container.getBoundingClientRect());
  }

  public getScrollInfo(): ScrollInfo {
    return ScrollInfo.form(this._container);
  }

  public scrollTo(x: number, y: number): void {
    this._container.scrollTo(x, y);
  }

  public scrollBy(x: number, y: number): void {
    this._container.scrollBy(x, y);
  }

  public getScrollTop(): number {
    return this._container.scrollTop;
  }

  public getScrollLeft(): number {
    return this._container.scrollLeft;
  }

  public whiteboard(whiteboard: WorkspaceWhiteboard): WorkspaceWindow {
    this._whiteboard = whiteboard;
    return this;
  }

  public background(background: WorkspaceBackground): WorkspaceWindow {
    this._background = background;
    return this;
  }

  public addMouseWheelEventListener(listener: (this: HTMLElement, ev: WheelEvent) => any) {
    this._container.addEventListener('wheel', listener);
  }

  public center(): void {
    const whiteboardDimensions = this._whiteboard.getSize();
    const windowDimensions = this.getSize();
    const scrollX =
      whiteboardDimensions.width < windowDimensions.width
        ? windowDimensions.width - (windowDimensions.width - whiteboardDimensions.width) / 2 - WORKSPACE_MARGIN / 2
        : windowDimensions.width - WORKSPACE_MARGIN;
    const scrollY =
      whiteboardDimensions.height < windowDimensions.height
        ? windowDimensions.height - (windowDimensions.height - whiteboardDimensions.height) / 2 - WORKSPACE_MARGIN / 2
        : windowDimensions.height - WORKSPACE_MARGIN;
    this.scrollTo(scrollX, scrollY);
  }

  centerOnZoomIn(event?: MouseEvent): void {
    const zoomLevel = this._appStateService.getZoomLevel();
    if (zoomLevel.currentPercentageZoom == MAX_ZOOM_PERCENTAGE) {
      return;
    }
    this.continueScrollToSouthEast(this.getScrollInfoOnZoom(event));
  }

  centerOnZoomOut(event?: MouseEvent): void {
    const zoomLevel = this._appStateService.getZoomLevel();
    if (zoomLevel.currentPercentageZoom == MIN_ZOOM_PERCENTAGE) {
      return;
    }
    this.continueScrollToNorthWest(this.getScrollInfoOnZoom(event));
  }

  private continueScrollToSouthEast(scrollInfo: ScrollInfo): void {
    this.scrollBy(scrollInfo.scrollX, scrollInfo.scrollY);
  }

  private continueScrollToNorthWest(scrollInfo: ScrollInfo): void {
    this.scrollBy(-scrollInfo.scrollX, -scrollInfo.scrollY);
  }

  private getScrollInfoOnZoom(event?: MouseEvent): ScrollInfo {
    const zoomPercentage = this._appStateService.getZoomLevel().previousPercentageZoom;
    const mousePositionRelatedToWhiteboard = this.getMousePositionRelatedToWhiteboard(event);
    const scrollX = Math.floor((mousePositionRelatedToWhiteboard.x * ZOOM_PERCENTAGE_STEP) / zoomPercentage);
    const scrollY = Math.floor((mousePositionRelatedToWhiteboard.y * ZOOM_PERCENTAGE_STEP) / zoomPercentage);
    return {
      scrollX,
      scrollY,
    };
  }

  private getMousePositionRelatedToWhiteboard(event?: MouseEvent) {
    if (event) {
      const backgroundBoundingRect = this._background.getBoundingClientRect();
      return {
        x: event.clientX - backgroundBoundingRect.x - this._whiteboard.getX(),
        y: event.clientY - backgroundBoundingRect.y - this._whiteboard.getY(),
      };
    } else {
      const whiteboardSize = this._whiteboard.getSize();
      return {
        x: whiteboardSize.width / 2,
        y: whiteboardSize.height / 2,
      };
    }
  }

  private getClassName() {
    return `${this.props.className} workspace-window`;
  }
}
