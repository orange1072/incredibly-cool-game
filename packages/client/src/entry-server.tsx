import { Provider } from 'react-redux';
import { ServerStyleSheet } from 'styled-components';
import { Helmet } from 'react-helmet';
import { Request as ExpressRequest } from 'express';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import { matchRoutes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

import {
  createContext,
  createFetchRequest,
  createUrl,
} from './entry-server.utils';
import { reducer } from './store/store';
import './index.scss';
import { setPageHasBeenInitializedOnServer } from './store/slices/ssrSlice';
import { ROUTES } from './constants';

// Динамический импорт для react-dom/server
let ReactDOM: any;

export const render = async (req: ExpressRequest) => {
  // Динамически импортируем react-dom/server
  if (!ReactDOM) {
    ReactDOM = await import('react-dom/server');
  }

  const { query, dataRoutes } = createStaticHandler(ROUTES);
  const fetchRequest = createFetchRequest(req);
  const context = await query(fetchRequest);

  if (context instanceof Response) {
    throw context;
  }

  const store = configureStore({
    reducer,
  });

  const url = createUrl(req);
  const foundRoutes = matchRoutes(ROUTES, url);

  if (!foundRoutes) {
    throw new Error('Страница не найдена!');
  }

  store.dispatch(setPageHasBeenInitializedOnServer(true));

  const router = createStaticRouter(dataRoutes, context);
  const sheet = new ServerStyleSheet();
  try {
    const html = ReactDOM.renderToString(
      sheet.collectStyles(
        <Provider store={store}>
          <StaticRouterProvider router={router} context={context} />
        </Provider>
      )
    );
    const styleTags = sheet.getStyleTags();
    const helmet = Helmet.renderStatic();

    return {
      html,
      helmet,
      styleTags,
      initialState: store.getState(),
    };
  } finally {
    sheet.seal();
  }
};
