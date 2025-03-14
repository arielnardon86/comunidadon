// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.jpg', '**/*.png'],
  optimizeDeps: {
    include: ['react-select', 'react-icons'], // Asegura que estas dependencias se optimicen
  },
  build: {
    rollupOptions: {
      onLog(level, log, handler) {
        handler(level, log);
        console.log('Rollup Log:', log); // Logs para depuración
      },
    },
  },
});