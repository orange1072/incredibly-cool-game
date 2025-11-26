import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AppRouter } from './components/AppRouter/AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary';
import startServiceWorker from './utils/StartServiceWorker';
import './index.scss';
import { AuthProvider } from '@/components/AuthProvider/AuthProvider';

startServiceWorker();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  </Provider>
);
