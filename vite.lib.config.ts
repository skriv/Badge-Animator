import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/** Library — ESM + IIFE bundles. */
export default defineConfig({
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
    emptyOutDir: true,
    rollupOptions: {
      output: { compact: true },
    },
  },
});
