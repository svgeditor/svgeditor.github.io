import './whiteboard.scss';
import * as React from 'react';
import { IBackgroundGridService } from '../services/background-grid-service/IBackgroundGridService';
import { SVG } from '@svgdotjs/svg.js';
import { ISvgService } from '../services/svg-service/ISvgService';
import { BackgroundGridServiceFactory } from '../services/background-grid-service/BackgroundGridServiceFactory';
import { SvgServiceFactory } from '../services/svg-service/SvgServiceFactory';

export interface IWhiteboardProps {
  svgService?: ISvgService;
  backgroundGridService?: IBackgroundGridService;
}

export interface IWhiteboardState {}

export default class Whiteboard extends React.Component<IWhiteboardProps, IWhiteboardState> {
  private svgContainer: HTMLElement;
  private svgService: ISvgService;
  private backgroundGridService: IBackgroundGridService;

  constructor(props: IWhiteboardProps) {
    super(props);
    this.state = {};
    this.svgService = this.props.svgService ? this.props.svgService : SvgServiceFactory.create();
    this.backgroundGridService = this.props.backgroundGridService ? this.props.backgroundGridService : BackgroundGridServiceFactory.create();
  }

  public render() {
    return <div ref={(ref) => (this.svgContainer = ref)} className='whiteboard-container'></div>;
  }

  componentDidMount() {
    this.backgroundGridService.add(this.svgContainer);
    window.addEventListener('resize', () => this.backgroundGridService.reset(this.svgContainer));
    const svgRoot = SVG().addTo(this.svgContainer).size('100%', '100%');
    svgRoot.element('style').words(this.svgService.getStyles());
    this.svgContainer.addEventListener('mousedown', (event) => this.svgService.handleMouseDownEvent(svgRoot, event));
    this.svgContainer.addEventListener('click', (event) => this.svgService.handleClickEvent(svgRoot, event));
  }
}
