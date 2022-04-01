import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';

/** This way I'll have access to state
 * functions in preload script
 * to properly handle state change in
 * UI components
 */
const { store } = window.electron;

render(
  <React.StrictMode>
    <Provider store={store.default}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
