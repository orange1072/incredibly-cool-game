import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './index.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
// import startServiceWorker from './utils/StartServiceWorker';

const router = createBrowserRouter(routes);

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

// startServiceWorker();
