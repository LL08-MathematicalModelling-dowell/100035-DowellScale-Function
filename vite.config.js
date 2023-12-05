import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vitejs.dev/config/
// export default defineConfig(({ command }) => {
//   const config = {
//     plugins: [react()],
//     base: '/100035-DowellScale-Function',
//     server: {
//       port: 3000,
//     },
//   }

//   if (command !== 'serve') {
//     config.base = '/100035-DowellScale-Function'
//   }

//   return config
// })

export default defineConfig({
  base: "/100035-DowellScale-Function/",
  plugins: [react()],
  server: {
    port: 3000,
  },
})
