import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   base: '/100035-DowellScale-Function/',
//   // build: {
//   //   outDir: 'dist',
//   //   assetsDir: 'assets',
//   //   base: '/LL08-MathematicalModelling-dowell/100035-DowellScale-Function/', // Make sure this is set correctly
//   // },
//   plugins: [react()],
//   server: {
//     port: 3000,
//   },

  
// });


// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    base: '/',
    server: {
      port: 3000,
    },
  }

  if (command !== 'serve') {
    config.base = '/100035-DowellScale-Function/'
  }

  return config
})

//https://ll08-mathematicalmodelling-dowell.github.io/100035-DowellScale-Function/