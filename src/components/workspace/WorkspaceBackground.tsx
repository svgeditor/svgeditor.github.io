import './workspace.scss';
import * as React from 'react';
import { BoundingRectangle } from '../../models/BoundingRectangle';
import { ICreateSvgElementServiceFactory } from '../../services/ICreateSvgElementServiceFactory';
import { CreateSvgElementServiceFactory } from '../../services/impl/CreateSvgElementServiceFactory';

export interface IWorkspaceBackgroundProps {
  createSvgElementServiceFactory?: ICreateSvgElementServiceFactory;
}

export interface IWorkspaceBackgroundState {}

export default class WorkspaceBackground extends React.Component<IWorkspaceBackgroundProps, IWorkspaceBackgroundState> {
  private container: HTMLElement;
  private createSvgElementServiceFactory: ICreateSvgElementServiceFactory;

  constructor(props: IWorkspaceBackgroundProps) {
    super(props);
    this.createSvgElementServiceFactory = props.createSvgElementServiceFactory
      ? props.createSvgElementServiceFactory
      : new CreateSvgElementServiceFactory();
  }

  public render() {
    return (
      <div ref={(ref) => (this.container = ref)} className='workspace-background'>
        <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
          {this.props.children}
        </svg>
      </div>
    );
  }

  componentDidMount() {
    this.container.addEventListener('mousedown', this.handleMouseDownEvent.bind(this));
  }

  public size(width: number, height: number) {
    this.container.style.width = width + 'px';
    this.container.style.height = height + 'px';
  }

  public getBoundingRectangle(): BoundingRectangle {
    return BoundingRectangle.fromHTMLElement(this.container);
  }

  private handleMouseDownEvent(event: MouseEvent) {
    const createSvgElementService = this.createSvgElementServiceFactory.create();
    createSvgElementService.onMouseDown(event);
  }
}
