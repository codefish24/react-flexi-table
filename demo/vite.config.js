import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  resolve: {
    alias: {
      // import directly from source — no need to build first
      '@codefish24/react-flexi-table': path.resolve(__dirname, '../src/index.js'),
    },
  },
});
