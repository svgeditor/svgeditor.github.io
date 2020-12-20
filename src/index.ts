import './index.scss';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import Whiteboard from './components/Whiteboard';

ReactDom.render(React.createElement(Whiteboard), document.querySelector('body'));
