// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  // REPLACE your old 'resolve' object with this one
  resolve: {
    alias: [
      {
        find: /^process\/?$/, // Match 'process' and 'process/'
        replacement: 'process/browser',
      },
    ],
  },
})