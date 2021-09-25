import { ESvgElement } from './ESvgElement';
import { GridProps, GridPropsBuilder } from './GridProps';
import { RulerProps, RulerPropsBuilder } from './RulerProps';
import { Size } from './Size';
import { WhiteboardProps, WhiteboardPropsBuilder } from './WhiteboardProps';
import { ZoomLevel } from './ZoomLevel';

export class AppState {
  private zoomLevel: ZoomLevel = this.getZoomLevelInitValue();
  private gridProps: GridProps = this.getGridPropsInitValue();
  private rulerProps: RulerProps = this.getRulerPropsInitValue();
  private whiteboardProps: WhiteboardProps = this.getWhiteboardPropsInitValue();
  private selectedSvgElement: ESvgElement = ESvgElement.RECTANGLE;
  private static instance: AppState = new AppState();

  private constructor() {}

  static getInstance(): AppState {
    return AppState.instance;
  }

  getZoomLevel(): ZoomLevel {
    return this.zoomLevel;
  }

  getGridProps(): GridProps {
    return this.gridProps;
  }

  getRulerProps(): RulerProps {
    return this.rulerProps;
  }

  getWhiteboardProps(): WhiteboardProps {
    return this.whiteboardProps;
  }

  getSelectedSvgElement(): ESvgElement {
    return this.selectedSvgElement;
  }

  setSelectedSvgElement(selectedSvgElement: ESvgElement) {
    this.selectedSvgElement = selectedSvgElement;
  }

  increaseZoomLevel(): void {
    this.zoomLevel.increase();
  }

  decreaseZoomLevel(): void {
    this.zoomLevel.decrease();
  }

  getWhiteboardSize(zoomedValue = false): Size {
    if (zoomedValue) {
      return this.zoomLevel.getZoomedSize(this.whiteboardProps.getSize());
    }
    return this.whiteboardProps.getSize();
  }

  private getWhiteboardPropsInitValue(): WhiteboardProps {
    return new WhiteboardPropsBuilder().width(800).height(1100).build();
  }

  private getGridPropsInitValue(): GridProps {
    return new GridPropsBuilder().color('#00000022').backgroundColor('#fff').size(10).build();
  }

  private getRulerPropsInitValue(): RulerProps {
    return new RulerPropsBuilder().color('#00000044').backgroundColor('#fff').size(20).build();
  }

  private getZoomLevelInitValue(): ZoomLevel {
    return new ZoomLevel();
  }
}
