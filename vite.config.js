import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/100035-DowellScale-Function/",
  plugins: [react()],
  server: {
    port: 3000,
  },
})
