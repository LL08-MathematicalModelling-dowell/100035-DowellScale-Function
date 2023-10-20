import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // base: '/LL08-MathematicalModelling-dowell/100035-DowellScale-Function/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    base: '/LL08-MathematicalModelling-dowell/100035-DowellScale-Function/', // Make sure this is set correctly
  },
  plugins: [react()],
  server: {
    port: 3000,
  },
});
