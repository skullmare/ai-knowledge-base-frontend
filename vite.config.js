import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// __dirname в ESM-конфиге не существует — путь берётся из import.meta.url.
const resolve = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: { icon: true },
      include: '**/*.svg',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '@components': resolve('./src/components'),
      '@services': resolve('./src/services'),
      '@store': resolve('./src/store'),
      '@router': resolve('./src/router'),
      '@utils': resolve('./src/utils'),
      '@hooks': resolve('./src/hooks'),
      '@pages': resolve('./src/pages'),
      '@assets': resolve('./src/assets'),
      '@ui': resolve('./src/components/ui'),
      '@layout': resolve('./src/components/layout'),
      '@guards': resolve('./src/components/guards'),
    },
  },
});
