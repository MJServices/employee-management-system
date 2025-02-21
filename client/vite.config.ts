import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://employee-management-system-delta-two.vercel.app/',
        changeOrigin: true,
      },
    },
  }
})
