import './workspace.scss';
import * as React from 'react';
import { BoundingRectangle } from '../../models/BoundingRectangle';
import { ICreateSvgElementServiceFactory } from '../../services/ICreateSvgElementServiceFactory';
import { CreateSvgElementServiceFactory } from '../../services/impl/CreateSvgElementServiceFactory';
import { SvgGroup } from '../../models/svg-elements/SvgGroup';
import { IMoveSvgElementService } from '../../services/IMoveSvgElementService';
import { MoveSvgElementService } from '../../services/impl/MoveSvgElementService';

export interface IWorkspaceBackgroundProps {
  createSvgElementServiceFactory?: ICreateSvgElementServiceFactory;
  moveSvgElementService?: IMoveSvgElementService;
}

export interface IWorkspaceBackgroundState {}

export default class WorkspaceBackground extends React.Component<IWorkspaceBackgroundProps, IWorkspaceBackgroundState> {
  private container: HTMLElement;
  private createSvgElementServiceFactory: ICreateSvgElementServiceFactory;
  private moveSvgElementService: IMoveSvgElementService;

  constructor(props: IWorkspaceBackgroundProps) {
    super(props);
    this.createSvgElementServiceFactory = props.createSvgElementServiceFactory
      ? props.createSvgElementServiceFactory
      : new CreateSvgElementServiceFactory();
    this.moveSvgElementService = props.moveSvgElementService ? props.moveSvgElementService : new MoveSvgElementService();
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
    const svgElement = this.getSvgGroup(event);
    console.log(this.getSvgGroup(event));
    if (this.getSvgGroup(event)) {
      this.moveSvgElementService.moveOnMouseDown(event, svgElement);
    } else {
      const createSvgElementService = this.createSvgElementServiceFactory.create();
      createSvgElementService.createOnMouseDown(event);
    }
  }

  private getSvgGroup(event: MouseEvent): SvgGroup {
    return event.target instanceof SVGElement && event.target.closest('g') != null ? SvgGroup.from(event.target.closest('g')) : null;
  }
}
