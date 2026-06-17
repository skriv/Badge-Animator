import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** Playground SPA — deployed to Vercel. */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
  },
});
