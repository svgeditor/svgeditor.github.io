import './whiteboard.scss';
import * as React from 'react';
import { IAppStateService } from '../../services/api/IAppStateService';
import { SVG } from '@svgdotjs/svg.js';
import { ISvgService } from '../../services/api/ISvgService';
import { SvgService } from '../../services/impl/SvgService';
import { AppStateService } from '../../services/impl/AppStateService';
import { Dimensions } from '../../models/Dimension';

export interface IWhiteboardProps {
  svgService?: ISvgService;
  appStateService?: IAppStateService;
}

export interface IWhiteboardState {}

export default class Whiteboard extends React.Component<IWhiteboardProps, IWhiteboardState> {
  private container: HTMLElement;
  private containerDimensions: Dimensions;
  private svgDimensions: Dimensions;
  private svgBackground: HTMLElement;
  private svgContainer: HTMLElement;
  private svgService: ISvgService;
  private appStateService: IAppStateService;
  private zoomPercentage = 100;
  private svgMargin = 25;

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
    const containerRect = this.container.getBoundingClientRect();
    this.containerDimensions = { width: containerRect.width, height: containerRect.height };
    const svg = SVG().addTo(this.svgContainer).size('100%', '100%');
    svg.element('style').words(this.svgService.getStyles());
    this.appStateService.setSvg(svg);
    this.setSvgDimensions(850, 1100);
    this.resizeContainers();
    window.addEventListener('resize', this.resizeContainers.bind(this));
    this.svgContainer.addEventListener('mousedown', (event) => this.svgService.handleMouseDownEvent(event));
    this.svgContainer.addEventListener('click', (event) => this.svgService.handleClickEvent(event));
    this.container.addEventListener('wheel', this.handleMouseWheelEvent.bind(this));
    this.container.scrollTo(this.containerDimensions.width - this.svgMargin * 2, this.containerDimensions.height - this.svgMargin * 2);
  }

  private resizeContainers(): void {
    const containerWidth = this.containerDimensions.width;
    const containerHeight = this.containerDimensions.height;
    const svgWidth = this.svgDimensions.width;
    const svgHeight = this.svgDimensions.height;
    this.svgContainer.style.left = `${containerWidth - this.svgMargin}px`;
    this.svgContainer.style.width = `${svgWidth}px`;
    this.svgContainer.style.top = `${containerHeight - this.svgMargin}px`;
    this.svgContainer.style.height = `${svgHeight}px`;
    this.svgBackground.style.width = `${containerWidth * 2 + svgWidth - this.svgMargin * 2}px`;
    this.svgBackground.style.height = `${containerHeight * 2 + svgHeight - this.svgMargin * 2}px`;
  }

  private setSvgDimensions(width: number, height: number) {
    this.svgDimensions = {
      width,
      height,
    };
  }

  private handleMouseWheelEvent(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }
    }
  }

  private zoomIn() {
    if (this.zoomPercentage >= 300) return;
    const previousZoomPercentage = this.zoomPercentage;
    this.zoomPercentage += 5;
    this.resetSvgDimension(previousZoomPercentage, this.zoomPercentage);
    this.resizeContainers();
  }

  private zoomOut() {
    if (this.zoomPercentage < 25) return;
    const previousZoomPercentage = this.zoomPercentage;
    this.zoomPercentage -= 5;
    this.resetSvgDimension(previousZoomPercentage, this.zoomPercentage);
    this.resizeContainers();
  }

  private resetSvgDimension(percentageFrom: number, percentageTo: number) {
    this.svgDimensions = {
      width: (this.svgDimensions.width * percentageTo) / percentageFrom,
      height: (this.svgDimensions.height * percentageTo) / percentageFrom,
    };
  }
}
