import './index.scss';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import App from './components/app/App';

ReactDom.render(React.createElement(App), document.querySelector('main'));
