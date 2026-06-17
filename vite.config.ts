import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return { plugins: [react()] };
  }

  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'AnimatedBadge',
        formats: ['es', 'iife'],
        fileName: (format) =>
          format === 'iife' ? 'animated-badge.min.js' : 'animated-badge.esm.js',
      },
      minify: 'esbuild',
      target: 'es2020',
      sourcemap: true,
      outDir: 'dist',
      emptyOutDir: false,
      rollupOptions: {
        output: { compact: true },
      },
    },
  };
});
