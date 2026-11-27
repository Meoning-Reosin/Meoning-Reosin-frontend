import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 개발 중에는 /api 로 시작하는 요청을 백엔드(FastAPI, 8000번)로 넘긴다.
    // 브라우저는 주소가 하나(5173)라고 느끼므로 CORS 설정 없이 쿠키 로그인이 된다.
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
