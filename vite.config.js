import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tournament: resolve(__dirname, 'tournament.html')
      }
    },
    // 청크 크기 경고 임계값 증가
    chunkSizeWarningLimit: 1000,
    // CSS 코드 분할
    cssCodeSplit: true,
    // 소스맵 생성 (프로덕션에서는 false로 변경 가능)
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true,
    // CORS 설정 (Firebase와의 통신을 위해)
    cors: true
  },
  // 환경 변수 접두사
  envPrefix: 'VITE_'
});