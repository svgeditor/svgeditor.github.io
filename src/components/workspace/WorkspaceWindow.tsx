import './workspace.scss';
import * as React from 'react';
import { ScrollInfo } from '../../models/ScrollInfo';
import WorkspaceWhiteboard from './WorkspaceWhiteboard';
import { WORKSPACE_MARGIN } from '../../constants/constants';
import { ZOOM_PERCENTAGE_STEP } from '../../models/app-state/ZoomLevel';
import WorkspaceBackground from './WorkspaceBackground';
import { BoundingRectangle } from '../../models/BoundingRectangle';
import { AppState } from '../../models/app-state/AppState';

export interface IWorkspaceWindowProps {
  className?: string;
  appState?: AppState;
}

export interface IWorkspaceWindowState {}

export default class WorkspaceWindow extends React.Component<IWorkspaceWindowProps, IWorkspaceWindowState> {
  private appState: AppState;
  private container: HTMLElement;
  private whiteboard: WorkspaceWhiteboard;
  private background: WorkspaceBackground;

  constructor(props: IWorkspaceWindowProps) {
    super(props);
    this.appState = props.appState ? props.appState : AppState.getInstance();
  }

  public render() {
    return (
      <div ref={(ref) => (this.container = ref)} className={this.getClassName()}>
        {this.props.children}
      </div>
    );
  }

  public getBoundingRectangle(): BoundingRectangle {
    return BoundingRectangle.fromHTMLElement(this.container);
  }

  public getScrollInfo(): ScrollInfo {
    return ScrollInfo.form(this.container);
  }

  public scrollTo(x: number, y: number): void {
    this.container.scrollTo(x, y);
  }

  public scrollBy(x: number, y: number): void {
    this.container.scrollBy(x, y);
  }

  public getScrollTop(): number {
    return this.container.scrollTop;
  }

  public getScrollLeft(): number {
    return this.container.scrollLeft;
  }

  public setWhiteboard(whiteboard: WorkspaceWhiteboard): WorkspaceWindow {
    this.whiteboard = whiteboard;
    return this;
  }

  public setBackground(background: WorkspaceBackground): WorkspaceWindow {
    this.background = background;
    return this;
  }

  public addMouseWheelEventListener(listener: (this: HTMLElement, ev: WheelEvent) => any) {
    this.container.addEventListener('wheel', listener);
  }

  public center(): void {
    const whiteboardBoundingRectangle = this.whiteboard.getBoundingRectangle();
    const windowBoundingRectangle = this.getBoundingRectangle();
    const scrollX =
      whiteboardBoundingRectangle.width < windowBoundingRectangle.width
        ? windowBoundingRectangle.width - (windowBoundingRectangle.width - whiteboardBoundingRectangle.width) / 2 - WORKSPACE_MARGIN / 2
        : windowBoundingRectangle.width - WORKSPACE_MARGIN;
    const scrollY =
      whiteboardBoundingRectangle.height < windowBoundingRectangle.height
        ? windowBoundingRectangle.height - (windowBoundingRectangle.height - whiteboardBoundingRectangle.height) / 2 - WORKSPACE_MARGIN / 2
        : windowBoundingRectangle.height - WORKSPACE_MARGIN;
    this.scrollTo(scrollX, scrollY);
  }

  centerOnZoomIn(event?: MouseEvent): void {
    const zoomLevel = this.appState.getZoomLevel();
    if (zoomLevel.currentPercentageZoom == zoomLevel.previousPercentageZoom) {
      return;
    }
    this.continueScrollToSouthEast(this.getScrollInfoOnZoom(event));
  }

  centerOnZoomOut(event?: MouseEvent): void {
    const zoomLevel = this.appState.getZoomLevel();
    if (zoomLevel.currentPercentageZoom == zoomLevel.previousPercentageZoom) {
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
    const zoomPercentage = this.appState.getZoomLevel().previousPercentageZoom;
    const mousePositionRelatedToWhiteboard = this.getMousePositionRelatedToWhiteboard(event);
    const scrollX = (mousePositionRelatedToWhiteboard.x * ZOOM_PERCENTAGE_STEP) / zoomPercentage;
    const scrollY = (mousePositionRelatedToWhiteboard.y * ZOOM_PERCENTAGE_STEP) / zoomPercentage;
    return {
      scrollX,
      scrollY,
    };
  }

  private getMousePositionRelatedToWhiteboard(event?: MouseEvent) {
    if (event) {
      const backgroundBoundingRectangle = this.background.getBoundingRectangle();
      const whiteboardBoundingRectangle = this.whiteboard.getBoundingRectangle();
      return {
        x: event.clientX - backgroundBoundingRectangle.x - whiteboardBoundingRectangle.x,
        y: event.clientY - backgroundBoundingRectangle.y - whiteboardBoundingRectangle.y,
      };
    } else {
      const whiteboardBoundingRectangle = this.whiteboard.getBoundingRectangle();
      return {
        x: whiteboardBoundingRectangle.width / 2,
        y: whiteboardBoundingRectangle.height / 2,
      };
    }
  }

  private getClassName() {
    return `${this.props.className} workspace-window`;
  }
}
