import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://adminapi.dotsafetyservice.com',
        changeOrigin: true,
      },
      '/sanctum': {
        target: 'https://adminapi.dotsafetyservice.com',
        changeOrigin: true,
      },
      '/storage': {
        target: 'https://adminapi.dotsafetyservice.com',
        changeOrigin: true,
      },
    },
  },
})
