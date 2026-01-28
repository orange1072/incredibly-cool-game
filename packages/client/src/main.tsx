import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './index.scss';
import { AuthProvider } from '@/providers/AuthProvider/AuthProvider';
import { MobileInputProvider } from '@/providers/MobileInputProvider/MobileInputProvider';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { ErrorBoundary } from './components/ErrorBoundary';
// import startServiceWorker from './utils/StartServiceWorker';

const router = createBrowserRouter(routes);

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <Provider store={store}>
    <AuthProvider>
      <ErrorBoundary>
        <MobileInputProvider>
          <RouterProvider router={router} />
        </MobileInputProvider>
      </ErrorBoundary>
    </AuthProvider>
  </Provider>
);

// startServiceWorker();
