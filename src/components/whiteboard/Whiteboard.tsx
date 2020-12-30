import './whiteboard.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/api/IAppStateService';
import { G, Shape, SVG } from '@svgdotjs/svg.js';
import { IWhiteboardDrawingService } from '../../services/api/IWhiteboardDrawingService';
import { WhiteboardDrawingService } from '../../services/impl/WhiteboardDrawingService';
import { AppStateService } from '../../services/impl/AppStateService';
import { IWhiteboardGridService } from '../../services/api/IWhiteboardGridService';
import { WhiteboardGridService } from '../../services/impl/WhiteboardGridService';
import { WhiteboardWindow } from '../../models/WhiteboardLayers';
import { IWhiteboardWindowService } from '../../services/api/IWhiteboardWindowService';
import { WhiteboardWindowService } from '../../services/impl/WhiteboardWindowService';
import { SHAPE_CLASS_NAME, USER_ACTION_EVENT_NAME } from '../../constants/constants';
import { IUserAction } from '../../models/user-actions/IUserAction';
import { DeleteShapes } from '../../models/user-actions/DeleteShapes';
import { ZoomInWhiteboard } from '../../models/user-actions/ZoomInWhiteboard';
import { ZoomOutWhiteboard } from '../../models/user-actions/ZoomOutWhiteboard';
import { BringShapesToFront } from '../../models/user-actions/BringShapesToFront';
import { SendShapesToBack } from '../../models/user-actions/SendShapesToBack';
import { SvgShape } from '../../models/SvgShape';
import { IWhiteboardRulerService } from '../../services/api/IWhiteboardRulerService';
import { WhiteboardRulerService } from '../../services/impl/WhiteboardRulerService';
import { SelectAllShapes } from '../../models/user-actions/SelectAllShapes';

export interface IWhiteboardProps {
  appStateService?: IAppStateService;
  backgroundGridService?: IWhiteboardGridService;
  whiteboardDrawingService?: IWhiteboardDrawingService;
  whiteboardWindowsService?: IWhiteboardWindowService;
  whiteboardRulerService?: IWhiteboardRulerService;
}

export interface IWhiteboardState {}

export default class Whiteboard extends React.Component<IWhiteboardProps, IWhiteboardState> {
  private whiteboard: HTMLElement;
  private whiteboardWindow: HTMLElement;
  private whiteboardBackground: HTMLElement;
  private whiteboardVerticalRuler: HTMLElement;
  private whiteboardHorizontalRuler: HTMLElement;
  private whiteboardWindowService: IWhiteboardWindowService;
  private whiteboardDrawingService: IWhiteboardDrawingService;
  private whiteboardGridService: IWhiteboardGridService;
  private whiteboardRulerService: IWhiteboardRulerService;
  private appStateService: IAppStateService;

  constructor(props: IWhiteboardProps) {
    super(props);
    this.state = {};
    this.whiteboardWindowService = this.props.whiteboardWindowsService ? this.props.whiteboardWindowsService : WhiteboardWindowService.getInstance();
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
    this.initWhiteboardWindow();
    this.whiteboardWindowService.resize();
    this.whiteboardGridService.resize();
    this.whiteboardRulerService.resize();
    this.whiteboardWindowService.centerOnStartUp();
    this.whiteboard.addEventListener('mousedown', this.handleMouseDownEvent.bind(this));
    this.whiteboard.addEventListener('click', this.handleClickEvent.bind(this));
    this.whiteboardWindow.addEventListener('wheel', this.handleMouseWheelEvent.bind(this));
    window.addEventListener('resize', this.handleWindowResizeEvent.bind(this));
    document.addEventListener(USER_ACTION_EVENT_NAME, this.handleUserActionEvent.bind(this));
  }

  private handleWindowResizeEvent() {
    this.whiteboardWindowService.resize();
    this.whiteboardWindowService.centerOnStartUp();
  }

  private handleUserActionEvent(event: CustomEvent<IUserAction>) {
    const userAction: IUserAction = event.detail;
    switch (true) {
      case userAction instanceof DeleteShapes:
        return this.whiteboardDrawingService.delete((userAction as DeleteShapes).shapes);
      case userAction instanceof ZoomInWhiteboard:
        return this.zoomIn();
      case userAction instanceof ZoomOutWhiteboard:
        return this.zoomOut();
      case userAction instanceof BringShapesToFront:
        return this.whiteboardDrawingService.bringToFront((userAction as BringShapesToFront).shapes);
      case userAction instanceof SendShapesToBack:
        return this.whiteboardDrawingService.sendToBack((userAction as SendShapesToBack).shapes);
      case userAction instanceof SelectAllShapes:
        return this.whiteboardDrawingService.selectAllShapes();
      default:
      // no thing to do here!
    }
  }

  private initWhiteboardWindow(): void {
    const svgRootElement = SVG().addTo(this.whiteboard).size('100%', '100%');
    svgRootElement.element('style').words(this.whiteboardDrawingService.getStyles());
    this.appStateService.setWhiteboardWindow(
      new WhiteboardWindow(
        this.whiteboard,
        this.whiteboardWindow,
        this.whiteboardBackground,
        this.whiteboardVerticalRuler,
        this.whiteboardHorizontalRuler,
        svgRootElement
      )
    );
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
    this.whiteboardDrawingService.unselectAllShapes();
    const target = event.target as HTMLElement;
    if (target.classList.contains(SHAPE_CLASS_NAME)) {
      return this.whiteboardDrawingService.select(this.toShape(target));
    }
  }

  handleMouseDownEvent(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target instanceof SVGSVGElement) {
      const shapeToDraw = this.appStateService.getShapeToDraw();
      if (shapeToDraw !== null) {
        return this.whiteboardDrawingService.drawOnMouseDown(event);
      }
      return this.whiteboardDrawingService.selectOnMouseDown(event);
    }
    if (target.classList.contains(SHAPE_CLASS_NAME)) {
      return this.whiteboardDrawingService.move(event, this.toShape(target));
    }
  }

  private zoomIn(event?: MouseEvent) {
    this.appStateService.increaseWhiteboardZoomLevel();
    this.whiteboardWindowService.resize();
    this.whiteboardGridService.resize();
    this.whiteboardRulerService.resize();
    this.whiteboardDrawingService.resizeAllShapes();
    this.whiteboardWindowService.centerOnZoomIn(event);
  }

  private zoomOut(event?: MouseEvent) {
    this.appStateService.decreaseWhiteboardZoomLevel();
    this.whiteboardWindowService.resize();
    this.whiteboardGridService.resize();
    this.whiteboardRulerService.resize();
    this.whiteboardDrawingService.resizeAllShapes();
    this.whiteboardWindowService.centerOnZoomOut(event);
  }

  private toShape(target): SvgShape<Shape> {
    const shape = SVG(target) as Shape;
    return new SvgShape(shape.parent() as G, shape);
  }
}
