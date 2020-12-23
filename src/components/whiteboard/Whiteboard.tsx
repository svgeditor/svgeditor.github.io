import './whiteboard.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/api/IAppStateService';
import { SVG } from '@svgdotjs/svg.js';
import { ISvgService } from '../../services/api/ISvgService';
import { SvgService } from '../../services/impl/SvgService';
import { AppStateService } from '../../services/impl/AppStateService';

export interface IWhiteboardProps {
  svgService?: ISvgService;
  appStateService?: IAppStateService;
}

export interface IWhiteboardState {}

const MAX_ZOOM_PERCENTAGE = 800;
const MIN_ZOOM_PERCENTAGE = 25;
const ZOOM_PERCENTAGE_STEP = 5;
const SVG_MARGIN = 25;
const DELETE_KEY_CODE = 46;

export default class Whiteboard extends React.Component<IWhiteboardProps, IWhiteboardState> {
  private container: HTMLElement;
  private svgBackground: HTMLElement;
  private svgContainer: HTMLElement;
  private svgService: ISvgService;
  private appStateService: IAppStateService;

  constructor(props: IWhiteboardProps) {
    super(props);
    this.state = {};
    this.svgService = this.props.svgService ? this.props.svgService : new SvgService();
    this.appStateService = this.props.appStateService ? this.props.appStateService : AppStateService.getInstance();
  }

  public render() {
    return (
      <div ref={(ref) => (this.container = ref)} className='whiteboard-container'>
        <div ref={(ref) => (this.svgBackground = ref)} className='svg-background'>
          <div ref={(ref) => (this.svgContainer = ref)} className='svg-container'></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.InitContainersDimensions();
    this.initSvg();
    window.addEventListener('resize', this.resizeContainers.bind(this));
    this.svgContainer.addEventListener('mousedown', (event) => this.svgService.handleMouseDownEvent(event));
    this.svgContainer.addEventListener('click', (event) => this.svgService.handleClickEvent(event));
    this.container.addEventListener('wheel', this.handleMouseWheelEvent.bind(this));
    this.container.addEventListener('click', (event) => console.log(event.clientX));
    document.addEventListener('keydown', this.handleKeyPressEvent.bind(this));
  }

  private initSvg(): void {
    const svg = SVG().addTo(this.svgContainer).size('100%', '100%');
    svg.element('style').words(this.svgService.getStyles());
    this.appStateService.setSvg(svg);
  }

  private InitContainersDimensions(): void {
    this.resizeContainers();
    const containerRect = this.container.getBoundingClientRect();
    this.svgContainer.style.left = `${containerRect.width - SVG_MARGIN}px`;
    this.svgContainer.style.top = `${containerRect.height - SVG_MARGIN}px`;
    this.container.scrollTo(containerRect.width - SVG_MARGIN, containerRect.height - SVG_MARGIN);
  }

  private resizeContainers(): void {
    const containerRect = this.container.getBoundingClientRect();
    const svgWidth = this.appStateService.getSvgWidth();
    const svgHeight = this.appStateService.getSvgHeight();
    this.svgContainer.style.width = `${svgWidth}px`;
    this.svgContainer.style.height = `${svgHeight}px`;
    this.svgBackground.style.width = `${containerRect.width * 2 + svgWidth - 2 * SVG_MARGIN}px`;
    this.svgBackground.style.height = `${containerRect.height * 2 + svgHeight - 2 * SVG_MARGIN}px`;
  }

  private handleKeyPressEvent(event) {
    if (event.keyCode == DELETE_KEY_CODE) {
      this.svgService.deleteSelectedShapes();
    }
  }

  private handleMouseWheelEvent(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
      const svgBackgroundRectBeforeResize = this.svgBackground.getBoundingClientRect();
      if (event.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
      const svgBackgroundRectAfterResize = this.svgBackground.getBoundingClientRect();
      const widthChange = svgBackgroundRectAfterResize.width - svgBackgroundRectBeforeResize.width;
      const heightChange = svgBackgroundRectAfterResize.height - svgBackgroundRectBeforeResize.height;
      console.log(
        `widthChange: ${widthChange}. heightChange: ${heightChange}. scrollLeft: ${this.container.scrollLeft}, scrollTop: ${this.container.scrollTop}`
      );
    }
  }

  private zoomIn() {
    if (this.appStateService.getCurrentZoomPercentage() >= MAX_ZOOM_PERCENTAGE) return;
    this.appStateService.increaseZoomPercentageBy(ZOOM_PERCENTAGE_STEP);
    this.resizeContainers();
    this.svgService.resize();
  }

  private zoomOut() {
    if (this.appStateService.getCurrentZoomPercentage() <= MIN_ZOOM_PERCENTAGE) return;
    this.appStateService.reduceZoomPercentageBy(ZOOM_PERCENTAGE_STEP);
    this.resizeContainers();
    this.svgService.resize();
  }
}
