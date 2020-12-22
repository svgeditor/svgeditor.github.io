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
    this.resizeContainers();
    const svg = SVG().addTo(this.svgContainer).size('100%', '100%');
    this.appStateService.setSvg(svg);
    svg.element('style').words(this.svgService.getStyles());
    window.addEventListener('resize', this.resizeContainers.bind(this));
    this.svgContainer.addEventListener('mousedown', (event) => this.svgService.handleMouseDownEvent(event));
    this.svgContainer.addEventListener('click', (event) => this.svgService.handleClickEvent(event));
  }

  private resizeContainers(): void {
    const whiteboardDimensions = this.whiteboardContainer.getBoundingClientRect();
    const svgMargin = 25;
    const svgWidth = whiteboardDimensions.width - svgMargin * 2;
    const svgHeight = whiteboardDimensions.height - svgMargin * 2;
    this.svgContainer.style.position = 'absolute';
    this.svgContainer.style.left = `${svgWidth + svgMargin}px`;
    this.svgContainer.style.width = `${svgWidth}px`;
    this.svgContainer.style.top = `${svgHeight + svgMargin}px`;
    this.svgContainer.style.height = `${svgHeight}px`;
    this.svgBackground.style.width = `${svgWidth * 3 + svgMargin * 2}px`;
    this.svgBackground.style.height = `${svgHeight * 3 + svgMargin * 2}px`;
    this.whiteboardContainer.scrollTo(svgWidth, svgHeight);
  }
}
