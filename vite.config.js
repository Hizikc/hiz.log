import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import inject from 'vite-plugin-html-inject';

// Функция, которая сама соберет все html файлы из папок для сборки
function getHtmlInputs(dir, inputFiles = {}) {
  if (!fs.existsSync(dir)) return inputFiles;
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const res = resolve(dir, file);
    if (fs.statSync(res).isDirectory()) {
      getHtmlInputs(res, inputFiles);
    } else if (file.endsWith('.html')) {
      // Делаем имя ключа понятным для Rollup
      const key = res.replace(__dirname, '').replace(/[\/\\]/g, '_').replace('.html', '');
      inputFiles[key] = res;
    }
  });
  return inputFiles;
}

const pages = getHtmlInputs(resolve(__dirname, 'pages'));

export default defineConfig({
  plugins: [
    inject() // Включаем плагин для вставок <load src="..." />
  ],
  server: {
    host: '127.0.0.1',
    port: 3000,
    open: true // Автоматом откроет браузер при старте локалки
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        ...pages // Подкидываем все остальные страницы из папок
      }
    }
  }
});
