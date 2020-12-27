import './whiteboard.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/api/IAppStateService';
import { SVG } from '@svgdotjs/svg.js';
import { IWhiteboardDrawingService } from '../../services/api/IWhiteboardDrawingService';
import { WhiteboardDrawingService } from '../../services/impl/WhiteboardDrawingService';
import { AppStateService } from '../../services/impl/AppStateService';
import { IWhiteboardGridService } from '../../services/api/IWhiteboardGridService';
import { WhiteboardGridService } from '../../services/impl/WhiteboardGridService';
import { WhiteboardLayers } from '../../models/WhiteboardLayers';
import { IWhiteboardLayersService } from '../../services/api/IWhiteboardLayersService';
import { WhiteboardLayersService } from '../../services/impl/WhiteboardLayersService';
import {
  BRING_SELECTED_SHAPE_TO_FRONT_EVENT_NAME,
  DELETE_SELECTED_SHAPES_EVENT_NAME,
  SELECTED_SHAPES_DELETED_EVENT,
  SEND_SELECTED_SHAPE_TO_BACK_EVENT_NAME,
  ZOOM_IN_EVENT_NAME,
  ZOOM_OUT_EVENT_NAME,
} from '../../models/CustomEvents';

export interface IWhiteboardProps {
  appStateService?: IAppStateService;
  backgroundGridService?: IWhiteboardGridService;
  whiteboardDrawingService?: IWhiteboardDrawingService;
  whiteboardLayersService?: IWhiteboardLayersService;
}

export interface IWhiteboardState {}

const DELETE_KEY_CODE = 46;

export default class Whiteboard extends React.Component<IWhiteboardProps, IWhiteboardState> {
  private whiteboard: HTMLElement;
  private whiteboardWindow: HTMLElement;
  private whiteboardBackground: HTMLElement;
  private whiteboardVerticalRuler: HTMLElement;
  private whiteboardHorizontalRuler: HTMLElement;
  private whiteboardLayers: WhiteboardLayers;
  private whiteboardLayersService: IWhiteboardLayersService;
  private whiteboardDrawingService: IWhiteboardDrawingService;
  private appStateService: IAppStateService;
  private backgroundGridService: IWhiteboardGridService;

  constructor(props: IWhiteboardProps) {
    super(props);
    this.state = {};
    this.whiteboardLayersService = this.props.whiteboardLayersService ? this.props.whiteboardLayersService : new WhiteboardLayersService();
    this.whiteboardDrawingService = this.props.whiteboardDrawingService ? this.props.whiteboardDrawingService : new WhiteboardDrawingService();
    this.appStateService = this.props.appStateService ? this.props.appStateService : AppStateService.getInstance();
    this.backgroundGridService = this.backgroundGridService ? this.props.backgroundGridService : new WhiteboardGridService();
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
    this.whiteboardLayers = new WhiteboardLayers(
      this.whiteboard,
      this.whiteboardWindow,
      this.whiteboardBackground,
      this.whiteboardVerticalRuler,
      this.whiteboardHorizontalRuler
    );
    this.whiteboardLayersService.init(this.whiteboardLayers);
    this.initSvgRootElement();
    this.whiteboard.addEventListener('mousedown', (event) => this.whiteboardDrawingService.handleMouseDownEvent(event));
    this.whiteboard.addEventListener('click', (event) => this.whiteboardDrawingService.handleClickEvent(event));
    this.whiteboardWindow.addEventListener('wheel', this.handleMouseWheelEvent.bind(this));
    document.addEventListener('keydown', this.handleKeyPressEvent.bind(this));
    document.addEventListener(DELETE_SELECTED_SHAPES_EVENT_NAME, this.handleDeleteSelectedShapesEvent.bind(this));
    document.addEventListener(ZOOM_IN_EVENT_NAME, () => this.whiteboardLayersService.zoomIn());
    document.addEventListener(ZOOM_OUT_EVENT_NAME, () => this.whiteboardLayersService.zoomOut());
    document.addEventListener(BRING_SELECTED_SHAPE_TO_FRONT_EVENT_NAME, () => this.whiteboardDrawingService.bringSelectedShapesToFront());
    document.addEventListener(SEND_SELECTED_SHAPE_TO_BACK_EVENT_NAME, () => this.whiteboardDrawingService.sendSelectedShapesToBack());
  }

  private handleDeleteSelectedShapesEvent() {
    this.whiteboardDrawingService.deleteSelectedShapes();
    document.dispatchEvent(SELECTED_SHAPES_DELETED_EVENT);
  }

  private initSvgRootElement(): void {
    const svgRootElement = SVG().addTo(this.whiteboard).size('100%', '100%');
    svgRootElement.element('style').words(this.whiteboardDrawingService.getStyles());
    this.appStateService.setSvgRootElement(svgRootElement);
  }

  private handleKeyPressEvent(event: KeyboardEvent) {
    if (event.keyCode == DELETE_KEY_CODE) {
      this.whiteboardDrawingService.deleteSelectedShapes();
    }
  }

  private handleMouseWheelEvent(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        this.whiteboardLayersService.zoomIn(event);
      } else {
        this.whiteboardLayersService.zoomOut(event);
      }
    }
  }
}
