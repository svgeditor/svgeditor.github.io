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
const ZOOM_PERCENTAGE_STEP = 10;
const SVG_MARGIN = 25;
const DELETE_KEY_CODE = 46;

export default class Whiteboard extends React.Component<IWhiteboardProps, IWhiteboardState> {
  private whiteboardContainer: HTMLElement;
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
      <div ref={(ref) => (this.whiteboardContainer = ref)} className='whiteboard-container'>
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
    this.whiteboardContainer.addEventListener('wheel', this.handleMouseWheelEvent.bind(this));
    document.addEventListener('keydown', this.handleKeyPressEvent.bind(this));
    this.svgBackground.addEventListener('click', (event) => {
      const svgBackgroundRect = this.svgBackground.getBoundingClientRect();
      console.log(event.clientX - svgBackgroundRect.x);
    });
  }

  private initSvg(): void {
    const svg = SVG().addTo(this.svgContainer).size('100%', '100%');
    svg.element('style').words(this.svgService.getStyles());
    this.appStateService.setSvg(svg);
  }

  private InitContainersDimensions(): void {
    this.resizeContainers();
    const containerRect = this.whiteboardContainer.getBoundingClientRect();
    this.svgContainer.style.left = `${containerRect.width - SVG_MARGIN}px`;
    this.svgContainer.style.top = `${containerRect.height - SVG_MARGIN}px`;
    this.whiteboardContainer.scrollTo(containerRect.width - SVG_MARGIN, containerRect.height - SVG_MARGIN);
  }

  private resizeContainers(): void {
    const containerRect = this.whiteboardContainer.getBoundingClientRect();
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
      const whiteboardContainerRect = this.whiteboardContainer.getBoundingClientRect();
      const mousePositionRelatedToWhiteboardContainer = {
        x: event.clientX - whiteboardContainerRect.x,
        y: event.clientY - whiteboardContainerRect.y,
      };
      const svgBackgroundRectBeforeZoom = this.svgBackground.getBoundingClientRect();
      const mousePositionRelatedToSvgBackgroundContainerBeforeZoom = {
        x: event.clientX - svgBackgroundRectBeforeZoom.x,
        y: event.clientY - svgBackgroundRectBeforeZoom.y,
      };
      let zoomResult;
      if (event.deltaY < 0) {
        zoomResult = this.zoomIn();
      } else {
        zoomResult = this.zoomOut();
      }
      if (zoomResult) {
        const svgBackgroundRectAfterZoom = this.svgBackground.getBoundingClientRect();
        const svgBackgroundRectWidthChange = svgBackgroundRectAfterZoom.width - svgBackgroundRectBeforeZoom.width;
        const svgBackgroundRectHeightChange = svgBackgroundRectAfterZoom.height - svgBackgroundRectBeforeZoom.height;
        const svgBackgroundRectWidthChangeRelatedToMousePosition =
          (svgBackgroundRectWidthChange * mousePositionRelatedToWhiteboardContainer.x) / whiteboardContainerRect.width;
        const svgBackgroundRectHeightChangeRelatedToMousePosition =
          (svgBackgroundRectHeightChange * mousePositionRelatedToWhiteboardContainer.y) / whiteboardContainerRect.height;
        const expectedMousePositionRelatedToSvgBackgroundContainerAfterZoom = {
          x: mousePositionRelatedToSvgBackgroundContainerBeforeZoom.x + svgBackgroundRectWidthChangeRelatedToMousePosition,
          y: mousePositionRelatedToSvgBackgroundContainerBeforeZoom.y + svgBackgroundRectHeightChangeRelatedToMousePosition,
        };
        const scrollX = expectedMousePositionRelatedToSvgBackgroundContainerAfterZoom.x - mousePositionRelatedToWhiteboardContainer.x;
        const scrollY = expectedMousePositionRelatedToSvgBackgroundContainerAfterZoom.y - mousePositionRelatedToWhiteboardContainer.y;
        this.whiteboardContainer.scrollTo(scrollX, scrollY);
      }
    }
  }

  private zoomIn(): boolean {
    if (this.appStateService.getCurrentZoomPercentage() >= MAX_ZOOM_PERCENTAGE) return false;
    this.appStateService.increaseZoomPercentageBy(ZOOM_PERCENTAGE_STEP);
    this.resizeContainers();
    this.svgService.resize();
    return true;
  }

  private zoomOut(): boolean {
    if (this.appStateService.getCurrentZoomPercentage() <= MIN_ZOOM_PERCENTAGE) return false;
    this.appStateService.reduceZoomPercentageBy(ZOOM_PERCENTAGE_STEP);
    this.resizeContainers();
    this.svgService.resize();
    return true;
  }
}
