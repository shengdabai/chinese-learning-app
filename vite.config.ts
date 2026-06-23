import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // env loaded for future server-side use; source code reads import.meta.env.VITE_GEMINI_API_KEY
    // which Vite exposes automatically for VITE_* prefixed vars — no define block needed.
    loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: 'localhost',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
