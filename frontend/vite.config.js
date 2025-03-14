// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Configuración de assets
  assetsInclude: ['**/*.jpg', '**/*.png'],
  // Configuración de variables de entorno
  define: {
    // No inyectes process.env directamente; usa import.meta.env en el código
  },
  // Opcional: Configurar resolución de variables de entorno en el build
  build: {
    rollupOptions: {
      // Añadir logs para depuración (opcional)
      onLog(level, log, handler) {
        handler(level, log);
        console.log('Rollup Log:', log); // Ayuda a depurar si el error persiste
      },
    },
  },
});