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
import { Readable } from 'stream';

const port = process.env.CLIENT_PORT || 3000;
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

  // Proxy API calls from browser (same-origin) to internal server container.
  // This avoids calling `:3001` directly from the browser (which may be закрыт наружу).
  const internalServerUrl =
    process.env.INTERNAL_SERVER_URL || 'http://server:3001';
  app.use(['/api', '/ya-api'], async (req, res, next) => {
    try {
      const targetUrl = new URL(req.originalUrl, internalServerUrl).toString();

      // Forward almost all headers (drop hop-by-hop + host)
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (!value) continue;
        if (key.toLowerCase() === 'host') continue;
        if (Array.isArray(value)) {
          for (const v of value) headers.append(key, v);
        } else {
          headers.set(key, value);
        }
      }

      const init: any = {
        method: req.method,
        headers,
        redirect: 'manual',
      };

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        // Node fetch needs duplex when body is a stream
        init.body = req;
        init.duplex = 'half';
      }

      const upstream = await fetch(targetUrl, init);

      res.status(upstream.status);
      // Forward headers (special-case Set-Cookie because it must not be collapsed into a single comma-separated value)
      const setCookie =
        // Node 20+ fetch Headers may support getSetCookie()
        typeof (upstream.headers as any).getSetCookie === 'function'
          ? ((upstream.headers as any).getSetCookie() as string[])
          : [];

      upstream.headers.forEach((v, k) => {
        const lk = k.toLowerCase();
        // Drop hop-by-hop headers
        if (
          [
            'connection',
            'keep-alive',
            'proxy-authenticate',
            'proxy-authorization',
            'te',
            'trailer',
            'transfer-encoding',
            'upgrade',
          ].includes(lk)
        ) {
          return;
        }
        // We'll set Set-Cookie separately (see below)
        if (lk === 'set-cookie') return;

        res.setHeader(k, v);
      });

      if (setCookie.length > 0) {
        res.setHeader('set-cookie', setCookie);
      }

      if (upstream.body) {
        Readable.fromWeb(upstream.body as any).pipe(res);
      } else {
        res.end();
      }
    } catch (e) {
      next(e);
    }
  });
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

      // Runtime env для браузера (Vite env вшивается на build-time, но нам нужен стабильный источник в prod/SSR)
      // Берём сначала VITE_* (если есть), иначе fallback на переменные без префикса.
      const clientEnv = {
        VITE_SUPABASE_URL:
          process.env.VITE_SUPABASE_URL ||
          process.env.SUPABASE_URL ||
          undefined,
        VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
          process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
          process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
          process.env.SUPABASE_ANON_KEY ||
          undefined,
      };

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
          `<script>
            window.APP_INITIAL_STATE = ${serialize(initialState, { isJSON: true })};
            window.APP_ENV = ${serialize(clientEnv, { isJSON: true })};
          </script>`
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
    console.log(`Client is listening on port: ${port}`);
  });
}

createServer().catch(console.error);
