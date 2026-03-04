import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync } from 'fs'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    {
      name: 'static-dirs',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Serve /script → /script/index.html from public/
          if (req.url === '/script' || req.url === '/script/') {
            const file = resolve(__dirname, 'public/script/index.html')
            if (existsSync(file)) {
              req.url = '/script/index.html'
            }
          }
          next()
        })
      },
    },
    react(),
  ],
})
