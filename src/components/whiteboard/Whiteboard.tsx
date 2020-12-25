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
            <div ref={(ref) => (this.whiteboardHorizontalRuler = ref)} className='whiteboard-horizontal-ruler'></div>
          </div>
          <div className='whiteboard-rulers-container'>
            <div ref={(ref) => (this.whiteboardVerticalRuler = ref)} className='whiteboard-vertical-ruler'></div>
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
