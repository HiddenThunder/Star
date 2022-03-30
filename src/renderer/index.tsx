import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';

import store from './state';

render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
