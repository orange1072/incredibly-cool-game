import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AppRouter } from './components/AppRouter/AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary';
import startServiceWorker from './utils/StartServiceWorker';
import './index.scss';

startServiceWorker();

const root = ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </Provider>
);
