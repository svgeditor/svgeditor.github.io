import './workspace.scss';
import * as React from 'react';
import { BoundingRectangle } from '../../models/BoundingRectangle';
import { ISvgElementCreateServiceFactory } from '../../services/ISvgElementCreateServiceFactory';
import { SvgElementCreateServiceFactory } from '../../services/impl/SvgElementCreateServiceFactory';

export interface IWorkspaceBackgroundProps {
  svgElementCreateServiceFactory?: ISvgElementCreateServiceFactory;
}

export interface IWorkspaceBackgroundState {}

export default class WorkspaceBackground extends React.Component<IWorkspaceBackgroundProps, IWorkspaceBackgroundState> {
  private container: HTMLElement;
  private svgElementCreateServiceFactory: ISvgElementCreateServiceFactory;

  constructor(props: IWorkspaceBackgroundProps) {
    super(props);
    this.svgElementCreateServiceFactory = props.svgElementCreateServiceFactory
      ? props.svgElementCreateServiceFactory
      : new SvgElementCreateServiceFactory();
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
    const svgElementCreateService = this.svgElementCreateServiceFactory.create();
    svgElementCreateService.createOnMouseDown(event);
  }
}
