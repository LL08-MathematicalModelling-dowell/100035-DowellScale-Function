import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/LL08-MathematicalModelling-dowell/100035-DowellScale-Function/',
  plugins: [react()],
  server:{
    port:3000,
  },
});
