import { Shape } from '@svgdotjs/svg.js';

export const UNSELECT_ALL_SHAPES_EVENT_NAME = 'UNSELECT_ALL_SHAPES_EVENT';
export const UNSELECT_ALL_SHAPES_EVENT = new CustomEvent(UNSELECT_ALL_SHAPES_EVENT_NAME, {
  detail: {},
});

export const SELECT_SHAPE_EVENT_NAME = 'SELECT_SHAPE_EVENT_NAME';
export const createSelectShapeEvent = (shape: Shape) => {
  return new CustomEvent(SELECT_SHAPE_EVENT_NAME, {
    detail: {
      shape: shape,
    },
  });
};

export const NEW_UNDOABLE_ACTION_EVENT_NAME = 'NEW_UNDOABLE_ACTION_EVENT_NAME';
export const NEW_UNDOABLE_ACTION_EVENT = new CustomEvent(NEW_UNDOABLE_ACTION_EVENT_NAME, {
  detail: {},
});

export const DELETE_SELECTED_SHAPES_EVENT_NAME = 'DELETE_SELECTED_SHAPES_EVENT_NAME';
export const DELETE_SELECTED_SHAPES_EVENT = new CustomEvent(DELETE_SELECTED_SHAPES_EVENT_NAME, {
  detail: {},
});

export const SELECTED_SHAPES_DELETED_EVENT_NAME = 'SELECTED_SHAPES_DELETED_EVENT_NAME';
export const SELECTED_SHAPES_DELETED_EVENT = new CustomEvent(SELECTED_SHAPES_DELETED_EVENT_NAME, {
  detail: {},
});

export const ZOOM_IN_EVENT_NAME = 'ZOOM_IN_EVENT_NAME';
export const ZOOM_IN_EVENT = new CustomEvent(ZOOM_IN_EVENT_NAME, {
  detail: {},
});

export const ZOOM_OUT_EVENT_NAME = 'ZOOM_OUT_EVENT_NAME';
export const ZOOM_OUT_EVENT = new CustomEvent(ZOOM_OUT_EVENT_NAME, {
  detail: {},
});

export const BRING_SELECTED_SHAPE_TO_FRONT_EVENT_NAME = 'BRING_SELECTED_SHAPE_TO_FRONT_EVENT_NAME';
export const BRING_SELECTED_SHAPE_TO_FRONT_EVENT = new CustomEvent(BRING_SELECTED_SHAPE_TO_FRONT_EVENT_NAME, {
  detail: {},
});

export const SEND_SELECTED_SHAPE_TO_BACK_EVENT_NAME = 'SEND_SELECTED_SHAPE_TO_BACK_EVENT_NAME';
export const SEND_SELECTED_SHAPE_TO_BACK_EVENT = new CustomEvent(SEND_SELECTED_SHAPE_TO_BACK_EVENT_NAME, {
  detail: {},
});
