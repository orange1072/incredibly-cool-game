import dotenv from 'dotenv';
dotenv.config();

import { HelmetData } from 'react-helmet';
import express, { Request as ExpressRequest } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import serialize from 'serialize-javascript';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const port = process.env.PORT || 3002;
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';
const clientPath = path.resolve(__dirname, '..'); // packages/client
const indexHtmlPath = path.resolve(__dirname, '../../client/');
async function createServer() {
  const app = express();

  app.use(cookieParser());
  let vite: ViteDevServer | undefined;
  if (isDev) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      root: clientPath,
      appType: 'custom',
      ssr: {
        noExternal: ['styled-components'],
      },
    });
    app.use(vite.middlewares);
  } else {
    app.use(
      express.static(path.join(clientPath, 'dist/client'), { index: false })
    );
  }
  app.get('*', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Получаем файл client/index.html который мы правили ранее
      // Создаём переменные
      let render: (req: ExpressRequest) => Promise<{
        html: string;
        initialState: unknown;
        helmet: HelmetData;
        styleTags: string;
      }>;
      let template: string;
      if (vite) {
        template = await fs.readFile(
          path.join(indexHtmlPath, 'index.html'),
          'utf-8'
        );

        // Применяем встроенные HTML-преобразования vite и плагинов
        template = await vite.transformIndexHtml(url, template);

        // Загружаем модуль клиента, который писали выше,
        // он будет рендерить HTML-код
        render = (
          await vite.ssrLoadModule(
            path.join(clientPath, 'src/entry-server.tsx')
          )
        ).render;
      } else {
        template = await fs.readFile(
          path.join(clientPath, 'client/index.html'),
          'utf-8'
        );

        // Получаем путь до сбилдженого модуля клиента, чтобы не тащить средства сборки клиента на сервер
        const pathToServer = path.join(clientPath, 'server/entry-server.js');

        // Импортируем этот модуль и вызываем с инишл стейтом
        render = (await import(pathToServer)).render;
      }

      // Получаем HTML-строку из JSX
      const {
        html: appHtml,
        initialState,
        helmet,
        styleTags,
      } = await render(req);

      const html = template
        .replace('<!--ssr-styles-->', styleTags)
        .replace(
          `<!--ssr-helmet-->`,
          `${helmet.meta.toString()} ${helmet.title.toString()} ${helmet.link.toString()}`
        )
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(
          `<!--ssr-initial-state-->`,
          `<script>window.APP_INITIAL_STATE = ${serialize(initialState, {
            isJSON: true,
          })}</script>`
        );

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      if (vite) {
        vite.ssrFixStacktrace(e as Error);
      }
      next(e);
    }
  });

  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
}

createServer().catch(console.error);
