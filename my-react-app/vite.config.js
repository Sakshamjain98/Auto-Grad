import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  server: {
    proxy: {
      '/drive-api': {
        target: 'https://www.googleapis.com/upload/drive/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/drive-api/, ''),
      },
    },
  },
});
