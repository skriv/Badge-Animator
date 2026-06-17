import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/** Optional React wrapper — peer deps stay external. */
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/react/index.ts'),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    minify: 'esbuild',
    target: 'es2020',
    sourcemap: true,
    outDir: 'dist/react',
    emptyOutDir: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
