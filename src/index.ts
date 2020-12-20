import './index.scss';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import Whiteboard from './components/whiteboard';
import { SvgClient } from './components/svg-client.impl';

ReactDom.render(
  React.createElement(Whiteboard, {
    svgClient: SvgClient.getInstance(),
  }),
  document.querySelector('body')
);
