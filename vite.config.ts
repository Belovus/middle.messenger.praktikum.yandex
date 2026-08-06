import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
  server: {
    port: 3000
  },
  publicDir: 'static',
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'copy-static',
          writeBundle() {
            fs.cpSync('static', 'dist/static', { recursive: true })
          }
        }
      ]
    }
  }
})
