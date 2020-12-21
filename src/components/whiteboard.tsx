import './whiteboard.scss';
import * as React from 'react';
import { IBackgroundGridService } from '../services/api/IBackgroundGridService';
import { SVG } from '@svgdotjs/svg.js';
import { ISvgService } from '../services/api/ISvgService';
import { SvgService } from '../services/impl/SvgService';
import { BackgroundGridService } from '../services/impl/BackgroundGridService';

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
    this.svgService = this.props.svgService ? this.props.svgService : new SvgService();
    this.backgroundGridService = this.props.backgroundGridService ? this.props.backgroundGridService : new BackgroundGridService();
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
