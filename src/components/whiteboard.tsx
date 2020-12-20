import './whiteboard.scss';
import * as React from 'react';
import { createBlockElement } from './create-block-element';
import { ISvgClient } from './svg-client.interface';

export interface IWhiteboardProps {
  svgClient: ISvgClient;
}

export interface IWhiteboardState {}

export default class Whiteboard extends React.Component<IWhiteboardProps, IWhiteboardState> {
  private container: HTMLElement;

  constructor(props: IWhiteboardProps) {
    super(props);
    this.state = {};
  }

  public render() {
    return <div ref={(ref) => (this.container = ref)} className='whiteboard-container'></div>;
  }

  componentDidMount() {
    this.props.svgClient.init(this.container);
    this.container.addEventListener('mousedown', (event) => this.props.svgClient.createRectangle(event));
  }

  private handleMouseDownEvent(event) {
    this.container.append(createBlockElement(event));
  }
}
