import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Vite плагин для автоматической генерации Service Worker
 * с динамическим списком статических файлов после сборки.
 * Добавлены: версия кеша, защита от отсутствия плейсхолдера и очистка старых кешей.
 */
export function vitePluginServiceWorker() {
  return {
    name: 'vite-plugin-service-worker',
    apply: 'build',

    async writeBundle(options, bundle) {
      const outDir = options.dir || join(process.cwd(), 'dist/client');

      try {
        const bundleFiles = Object.keys(bundle)
          .map((fileName) => {
            const fileInfo = bundle[fileName];
            const filePath = fileInfo.fileName || fileName;
            const relativePath = '/' + filePath.replace(/\\/g, '/');
            return relativePath;
          })
          .filter((path) =>
            path.match(
              /\.(html|js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot)$/i
            )
          );

        const publicFiles = await getPublicFiles(outDir);

        const allFiles = ['/', ...new Set([...bundleFiles, ...publicFiles])]
          .filter((url) => url && url !== '/sw.js')
          .sort();

        const clientRoot = __dirname;
        const swSourcePath = join(clientRoot, 'public/sw.js');
        const swOutputPath = join(outDir, 'sw.js');

        if (!existsSync(swSourcePath)) {
          console.warn('⚠ sw.js not found in public folder');
          return;
        }

        const swContent = readFileSync(swSourcePath, 'utf-8');

        if (!/INJECT_URLS/.test(swContent)) {
          console.warn('⚠ Placeholder for URL injection not found in sw.js');
          return;
        }

        const urlListString = allFiles.map((url) => `    '${url}'`).join(',\n');

        const version = new Date()
          .toISOString()
          .replace(/[-:TZ.]/g, '')
          .slice(0, 12);

        let updatedSwContent = swContent
          .replace(
            /\/\* INJECT_URLS \*\/[\s\S]*?\/\* END_INJECT_URLS \*\//,
            `/* INJECT_URLS */\n${urlListString}\n  /* END_INJECT_URLS */`
          )
          .replace('__VERSION__', version);

        writeFileSync(swOutputPath, updatedSwContent, 'utf-8');

        console.log(
          `✅ [vite-plugin-service-worker] Generated with ${allFiles.length} cached URLs ` +
            `(${bundleFiles.length} bundle, ${publicFiles.length} public)`
        );
      } catch (error) {
        console.error('❌ Failed to generate Service Worker:', error);
      }
    },
  };
}

/**
 * Рекурсивно собирает файлы из папки public (копируются в dist)
 */
async function getPublicFiles(outDir, basePath = '', files = []) {
  try {
    const targetDir = basePath ? join(outDir, basePath) : outDir;

    if (!existsSync(targetDir)) return files;

    const entries = await readdir(targetDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === 'sw.js') continue;

      const relativePath = basePath
        ? join(basePath, entry.name).replace(/\\/g, '/')
        : entry.name;

      if (entry.isDirectory()) {
        await getPublicFiles(outDir, relativePath, files);
      } else if (entry.isFile()) {
        files.push('/' + relativePath);
      }
    }
  } catch {
    // Игнорируем ошибки доступа к папкам
  }

  return files;
}
