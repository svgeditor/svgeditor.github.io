import './whiteboard.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/api/IAppStateService';
import { G, Shape, SVG } from '@svgdotjs/svg.js';
import { IWhiteboardDrawingService } from '../../services/api/IWhiteboardDrawingService';
import { WhiteboardDrawingService } from '../../services/impl/WhiteboardDrawingService';
import { AppStateService } from '../../services/impl/AppStateService';
import { IWhiteboardGridService } from '../../services/api/IWhiteboardGridService';
import { WhiteboardGridService } from '../../services/impl/WhiteboardGridService';
import { WhiteboardLayers } from '../../models/WhiteboardLayers';
import { IWhiteboardLayersService } from '../../services/api/IWhiteboardLayersService';
import { WhiteboardLayersService } from '../../services/impl/WhiteboardLayersService';
import { SHAPE_CLASS_NAME, USER_ACTION_EVENT_NAME } from '../../constants/constants';
import { IUserAction } from '../../models/user-actions/IUserAction';
import { DeleteShape } from '../../models/user-actions/DeleteShape';
import { ZoomInWhiteboard } from '../../models/user-actions/ZoomInWhiteboard';
import { ZoomOutWhiteboard } from '../../models/user-actions/ZoomOutWhiteboard';
import { BringShapeToFront } from '../../models/user-actions/BringShapeToFront';
import { SendShapeToBack } from '../../models/user-actions/SendShapeToBack';
import { ShapeInfo } from '../../models/ShapeInfo';
import { IWhiteboardRulerService } from '../../services/api/IWhiteboardRulerService';
import { WhiteboardRulerService } from '../../services/impl/WhiteboardRulerService';

export interface IWhiteboardProps {
  appStateService?: IAppStateService;
  backgroundGridService?: IWhiteboardGridService;
  whiteboardDrawingService?: IWhiteboardDrawingService;
  whiteboardLayersService?: IWhiteboardLayersService;
  whiteboardRulerService?: IWhiteboardRulerService;
}

export interface IWhiteboardState {}

export default class Whiteboard extends React.Component<IWhiteboardProps, IWhiteboardState> {
  private whiteboard: HTMLElement;
  private whiteboardWindow: HTMLElement;
  private whiteboardBackground: HTMLElement;
  private whiteboardVerticalRuler: HTMLElement;
  private whiteboardHorizontalRuler: HTMLElement;
  private whiteboardLayers: WhiteboardLayers;
  private whiteboardLayersService: IWhiteboardLayersService;
  private whiteboardDrawingService: IWhiteboardDrawingService;
  private whiteboardGridService: IWhiteboardGridService;
  private whiteboardRulerService: IWhiteboardRulerService;
  private appStateService: IAppStateService;

  constructor(props: IWhiteboardProps) {
    super(props);
    this.state = {};
    this.whiteboardLayersService = this.props.whiteboardLayersService ? this.props.whiteboardLayersService : WhiteboardLayersService.getInstance();
    this.whiteboardDrawingService = this.props.whiteboardDrawingService
      ? this.props.whiteboardDrawingService
      : WhiteboardDrawingService.getInstance();
    this.whiteboardGridService = this.whiteboardGridService ? this.props.backgroundGridService : WhiteboardGridService.getInstance();
    this.whiteboardRulerService = this.whiteboardRulerService ? this.props.whiteboardRulerService : WhiteboardRulerService.getInstance();
    this.appStateService = this.props.appStateService ? this.props.appStateService : AppStateService.getInstance();
  }

  public render() {
    return (
      <div ref={(ref) => (this.whiteboardWindow = ref)} className='whiteboard-window-container'>
        <div ref={(ref) => (this.whiteboardBackground = ref)} className='whiteboard-background-container'>
          <div className='whiteboard-rulers-container'>
            <div className='whiteboard-rulers-corner'></div>
          </div>
          <div className='whiteboard-rulers-container'>
            <div className='whiteboard-horizontal-ruler'>
              <div className='ruler' ref={(ref) => (this.whiteboardHorizontalRuler = ref)}></div>
            </div>
          </div>
          <div className='whiteboard-rulers-container'>
            <div className='whiteboard-vertical-ruler'>
              <div className='ruler' ref={(ref) => (this.whiteboardVerticalRuler = ref)}></div>
            </div>
          </div>
          <div ref={(ref) => (this.whiteboard = ref)} className='whiteboard-container'></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.initWhiteboardLayers();
    this.whiteboardLayersService.resize();
    this.whiteboardGridService.resize();
    this.whiteboardRulerService.resize();
    this.whiteboardLayersService.centerOnStartUp();
    this.whiteboard.addEventListener('mousedown', this.handleMouseDownEvent.bind(this));
    this.whiteboard.addEventListener('click', this.handleClickEvent.bind(this));
    this.whiteboardWindow.addEventListener('wheel', this.handleMouseWheelEvent.bind(this));
    window.addEventListener('resize', this.handleWindowResizeEvent.bind(this));
    document.addEventListener(USER_ACTION_EVENT_NAME, this.handleUserActionEvent.bind(this));
  }

  private handleWindowResizeEvent() {
    this.whiteboardLayersService.resize();
    this.whiteboardLayersService.centerOnStartUp();
  }

  private handleUserActionEvent(event: CustomEvent<IUserAction>) {
    const userAction: IUserAction = event.detail;
    switch (true) {
      case userAction instanceof DeleteShape:
        this.whiteboardDrawingService.deleteShape((userAction as DeleteShape).shape);
        return;
      case userAction instanceof ZoomInWhiteboard:
        this.zoomIn();
        return;
      case userAction instanceof ZoomOutWhiteboard:
        this.zoomOut();
        return;
      case userAction instanceof BringShapeToFront:
        this.whiteboardDrawingService.bringShapeToFront((userAction as BringShapeToFront).shape);
        return;
      case userAction instanceof SendShapeToBack:
        this.whiteboardDrawingService.sendShapeToBack((userAction as SendShapeToBack).shape);
        return;
      default:
      // no thing to do here!
    }
  }

  private initWhiteboardLayers(): void {
    const svgRootElement = SVG().addTo(this.whiteboard).size('100%', '100%');
    svgRootElement.element('style').words(this.whiteboardDrawingService.getStyles());
    this.whiteboardLayers = new WhiteboardLayers(
      this.whiteboard,
      this.whiteboardWindow,
      this.whiteboardBackground,
      this.whiteboardVerticalRuler,
      this.whiteboardHorizontalRuler,
      svgRootElement
    );
    this.appStateService.setWhiteboardLayers(this.whiteboardLayers);
  }

  private handleMouseWheelEvent(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        this.zoomIn(event);
      } else {
        this.zoomOut(event);
      }
    }
  }

  handleClickEvent(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains(SHAPE_CLASS_NAME)) {
      return this.whiteboardDrawingService.select(this.toShape(target));
    }
    this.whiteboardDrawingService.unselectAll();
  }

  handleMouseDownEvent(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target instanceof SVGSVGElement) {
      return this.whiteboardDrawingService.createShapeOnMouseDown(event);
    }
    if (target.classList.contains(SHAPE_CLASS_NAME)) {
      return this.whiteboardDrawingService.move(event, this.toShape(target));
    }
  }

  private zoomIn(event?: MouseEvent) {
    this.appStateService.increaseWhiteboardZoomLevel();
    this.whiteboardLayersService.resize();
    this.whiteboardGridService.resize();
    this.whiteboardRulerService.resize();
    this.whiteboardDrawingService.resize();
    this.whiteboardLayersService.centerOnZoomIn(event);
  }

  private zoomOut(event?: MouseEvent) {
    this.appStateService.decreaseWhiteboardZoomLevel();
    this.whiteboardLayersService.resize();
    this.whiteboardGridService.resize();
    this.whiteboardRulerService.resize();
    this.whiteboardDrawingService.resize();
    this.whiteboardLayersService.centerOnZoomOut(event);
  }

  private toShape(target): ShapeInfo {
    const shape = SVG(target) as Shape;
    return new ShapeInfo(shape.parent() as G, shape);
  }
}
