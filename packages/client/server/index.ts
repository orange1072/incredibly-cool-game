import dotenv from 'dotenv';
dotenv.config();

import { HelmetData } from 'react-helmet';
import express, { Request as ExpressRequest } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import serialize from 'serialize-javascript';
import cookieParser from 'cookie-parser';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

const port = process.env.PORT || 3002;
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.env.NODE_ENV === 'development';
const clientPath = path.resolve(__dirname, '..'); // dist в production, packages/client в dev
const indexHtmlPath = path.resolve(__dirname, '../../client/');

// Функция для получения CSS ссылок в production режиме
async function getProductionCssLinks(): Promise<string> {
  try {
    // clientPath уже указывает на dist, поэтому путь: dist/client/assets
    const assetsPath = path.join(clientPath, 'client/assets');
    const files = await fs.readdir(assetsPath);
    const cssFiles = files.filter((file) => file.endsWith('.css'));

    return cssFiles
      .map((file) => `<link rel="stylesheet" href="/assets/${file}">`)
      .join('\n    ');
  } catch (error) {
    console.warn('Не удалось найти CSS файлы:', error);
    return '';
  }
}
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
        noExternal: ['@reduxjs/toolkit', 'styled-components'],
      },
    });
    app.use(vite.middlewares);
  } else {
    // В production clientPath указывает на dist, поэтому путь: dist/client
    app.use(express.static(path.join(clientPath, 'client'), { index: false }));
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
        // В production читаем обработанный index.html из dist/client
        // который уже содержит ссылки на CSS и JS файлы
        // clientPath уже указывает на dist, поэтому путь: dist/client/index.html
        template = await fs.readFile(
          path.join(clientPath, 'client/index.html'),
          'utf-8'
        );

        // Получаем путь до сбилдженого модуля клиента, чтобы не тащить средства сборки клиента на сервер
        // clientPath уже указывает на dist, поэтому используем относительный путь
        const pathToServer = path.join(clientPath, 'server/entry-server.js');

        // Импортируем этот модуль и вызываем с инишл стейтом
        // Преобразуем путь в file:// URL для совместимости с ESM на Windows
        const serverModuleUrl = pathToFileURL(pathToServer).href;
        render = (await import(serverModuleUrl)).render;
      }

      // Получаем HTML-строку из JSX
      const {
        html: appHtml,
        initialState,
        helmet,
        styleTags,
      } = await render(req);

      // В dev режиме Vite уже обработал HTML через transformIndexHtml и добавил стили
      // В production index.html уже содержит ссылки на CSS
      // Просто удаляем комментарий, так как стили уже в HTML
      const html = template
        .replace('<!--ssr-styles-->', '')
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
