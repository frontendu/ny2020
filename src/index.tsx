import React from 'react';
import ReactDOM from 'react-dom';

// @ts-ignore
import Snowflakes from 'magic-snowflakes';
import './index.css';

Snowflakes({
  color: '#FFF'
});

import { App } from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);