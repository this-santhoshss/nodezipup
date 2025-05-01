import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/main.ts'],
  format: ['cjs', 'esm'],
  target: 'node18',
  platform: 'node',
  dts: true,
  outDir: 'dist',
  clean: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
