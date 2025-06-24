import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      TanStackRouterVite({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),

        // fix loading all icon chunks in dev mode
        // https://github.com/tabler/tabler-icons/issues/1233
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
    // 환경별 설정
    define: {
      __APP_ENV__: JSON.stringify(mode),
    },
    // 개발 서버 설정
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3663',
          changeOrigin: true,
        },
      },
    },
    // 빌드 설정
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development' || mode === 'dev-local',
      // 운영 환경에서는 최적화 설정 추가
      minify: mode === 'production' ? 'terser' : 'esbuild',
      rollupOptions: mode === 'production' ? {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          },
        },
      } : undefined,
    },
  }
})
