import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // localhost 가 아니라 127.0.0.1 로 연다. 백엔드 Google 로그인 주소가 127.0.0.1 이라서
    // 로그인 쿠키도 127.0.0.1 에 붙는다. localhost 로 열면 브라우저가 다른 주소로 보고 쿠키를 안 보낸다.
    host: '127.0.0.1',
    port: 5173,
    // 개발 중에는 /api 로 시작하는 요청을 백엔드(FastAPI, 8000번)로 넘긴다.
    // 브라우저는 주소가 하나(5173)라고 느끼므로 CORS 설정 없이 쿠키 로그인이 된다.
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
