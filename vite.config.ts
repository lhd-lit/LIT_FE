import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    // HTML에서 crossorigin 속성 제거 (Electron app.asar에서 문제 발생 방지)
    {
      name: 'remove-crossorigin',
      transformIndexHtml(html) {
        return html
          .replace(/crossorigin=""/g, '')
          .replace(/crossorigin/g, '');
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // assetFileNames에서 crossorigin 제거를 위한 설정은 없지만
        // transformIndexHtml에서 처리
      },
    },
  },
})
