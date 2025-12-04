import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Request as ExpressRequest } from 'express';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import { matchRoutes } from 'react-router-dom';
import {
  createContext,
  createFetchRequest,
  createUrl,
} from './entry-server.utils';
import {
  createServerStore,
  setPageHasBeenInitializedOnServer,
} from './store/createServerStore';
import './index.scss';
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

  const store = createServerStore();

  const url = createUrl(req);
  const foundRoutes = matchRoutes(ROUTES, url);

  if (!foundRoutes) {
    throw new Error('Страница не найдена!');
  }

  store.dispatch(setPageHasBeenInitializedOnServer(true));

  const router = createStaticRouter(dataRoutes, context);
  const html = ReactDOM.renderToString(
    <Provider store={store}>
      <StaticRouterProvider router={router} context={context} />
    </Provider>
  );
  const helmet = Helmet.renderStatic();

  return {
    html,
    helmet,
    initialState: store.getState(),
    styleTags: '', // Пустая строка, так как ServerStyleSheet больше не используется
  };
};
