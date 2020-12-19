import './whiteboard.scss';
import * as React from 'react';
import { createBlockElement } from './create-block-element';

export interface IWhiteboardProps {}

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
    this.container.addEventListener('mousedown', this.handleMouseDownEvent.bind(this));
  }

  private handleMouseDownEvent(event) {
    this.container.append(createBlockElement(event));
  }
}
