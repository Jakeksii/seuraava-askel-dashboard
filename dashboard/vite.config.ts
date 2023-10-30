import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {

  if (command === 'serve') {
    return {
      plugins: [react()],
      define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
      },
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
          }
        }
      }
    }
  } else {
    return {
      plugins: [react()],
      define: {
        APP_VERSION: JSON.stringify(process.env.npm_package_version),
      },
      build: {
        outDir: '../server/public_dashboard'
      }
    }
  }
})