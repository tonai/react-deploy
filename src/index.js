import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom';

import './amplify';
import App from './components/App/App';

import './assets/css/main.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
