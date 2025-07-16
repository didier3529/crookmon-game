import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true,
    open: true,
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@contexts': '/src/contexts',
      '@core': '/src/core',
      '@services': '/src/services',
      '@types': '/src/types',
      '@assets': '/src/assets',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
