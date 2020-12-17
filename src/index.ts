import './index.scss';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import Hello from './hello';

ReactDom.render(React.createElement(Hello), document.querySelector('body'));
