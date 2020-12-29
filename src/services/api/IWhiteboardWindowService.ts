export interface IWhiteboardWindowService {
  resize(): void;
  centerOnStartUp(): void;
  centerOnZoomIn(event?: MouseEvent): void;
  centerOnZoomOut(event?: MouseEvent): void;
}
