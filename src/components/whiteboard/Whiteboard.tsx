import './whiteboard.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/api/IAppStateService';
import { SVG } from '@svgdotjs/svg.js';
import { IWhiteboardDrawingService } from '../../services/api/IWhiteboardDrawingService';
import { WhiteboardDrawingService } from '../../services/impl/WhiteboardDrawingService';
import { AppStateService } from '../../services/impl/AppStateService';
import { IBackgroundGridService } from '../../services/api/IBackgroundGridService';
import { BackgroundGridService } from '../../services/impl/BackgroundGridService';
import { WhiteboardLayers } from '../../models/WhiteboardLayers';
import { IWhiteboardLayersService } from '../../services/api/IWhiteboardLayersService';
import { WhiteboardLayersService } from '../../services/impl/WhiteboardLayersService';
import { IWhiteboardZoomService } from '../../services/api/IWhiteboardZoomService';
import { WhiteboardZoomService } from '../../services/impl/WhiteboardZoomService';

export interface IWhiteboardProps {
  appStateService?: IAppStateService;
  backgroundGridService?: IBackgroundGridService;
  whiteboardDrawingService?: IWhiteboardDrawingService;
  whiteboardLayersService?: IWhiteboardLayersService;
  whiteboardZoomService?: IWhiteboardZoomService;
}

export interface IWhiteboardState {}

const SVG_MARGIN = 25;
const DELETE_KEY_CODE = 46;

export default class Whiteboard extends React.Component<IWhiteboardProps, IWhiteboardState> {
  private whiteboard: HTMLElement;
  private whiteboardWindow: HTMLElement;
  private whiteboardBackground: HTMLElement;
  private whiteboardLayers: WhiteboardLayers;
  private whiteboardLayersService: IWhiteboardLayersService;
  private whiteboardDrawingService: IWhiteboardDrawingService;
  private whiteboardZoomService: IWhiteboardZoomService;
  private appStateService: IAppStateService;
  private backgroundGridService: IBackgroundGridService;

  constructor(props: IWhiteboardProps) {
    super(props);
    this.state = {};
    this.whiteboardLayersService = this.props.whiteboardLayersService ? this.props.whiteboardLayersService : new WhiteboardLayersService();
    this.whiteboardDrawingService = this.props.whiteboardDrawingService ? this.props.whiteboardDrawingService : new WhiteboardDrawingService();
    this.whiteboardZoomService = this.props.whiteboardZoomService
      ? this.props.whiteboardZoomService
      : new WhiteboardZoomService(this.whiteboardLayersService);
    this.appStateService = this.props.appStateService ? this.props.appStateService : AppStateService.getInstance();
    this.backgroundGridService = this.backgroundGridService ? this.props.backgroundGridService : new BackgroundGridService();
  }

  public render() {
    return (
      <div ref={(ref) => (this.whiteboardWindow = ref)} className='whiteboard-container'>
        <div ref={(ref) => (this.whiteboardBackground = ref)} className='svg-background'>
          <div ref={(ref) => (this.whiteboard = ref)} className='svg-container'></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.whiteboardLayers = new WhiteboardLayers(this.whiteboard, this.whiteboardWindow, this.whiteboardBackground);
    this.whiteboardLayersService.init(this.whiteboardLayers);
    this.initSvgRootElement();
    this.whiteboard.addEventListener('mousedown', (event) => this.whiteboardDrawingService.handleMouseDownEvent(event));
    this.whiteboard.addEventListener('click', (event) => this.whiteboardDrawingService.handleClickEvent(event));
    this.whiteboardWindow.addEventListener('wheel', this.handleMouseWheelEvent.bind(this));
    document.addEventListener('keydown', this.handleKeyPressEvent.bind(this));
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
      this.whiteboardZoomService.handleZoomEvent(event);
    }
  }
}
