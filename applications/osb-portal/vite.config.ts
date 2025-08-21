import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget = env.DOMAIN || "";
  const osbDomain = env && env.DOMAIN ? env.DOMAIN : 'localhost:8000';
  const replaceHost = (uri, appName) => uri.replace("://", "://" + appName + ".");

  return {
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/proxy/workspaces': {
        target: env.WORKSPACES_DOMAIN || replaceHost(proxyTarget, 'workspaces'),
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy\/workspaces/, ''),
      },
      '/proxy/accounts-api': {
        target: env.ACCOUNTS_API_DOMAIN ? (env.ACCOUNTS_API_DOMAIN) : replaceHost(proxyTarget, 'api.accounts'),
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy\/accounts-api/, ''),
      },
    },
  },
  build: {
    outDir: 'public',
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VITE_DOMAIN': JSON.stringify(env.DOMAIN || 'https://v2.opensourcebrain.org'),
    'process.env.VITE_NAMESPACE': JSON.stringify(env.NAMESPACE || 'osb2'),
    'process.env.VITE_ACCOUNTS_API_DOMAIN': JSON.stringify(env.ACCOUNTS_API_DOMAIN || ''),
    'process.env.VITE_WORKSPACES_DOMAIN': JSON.stringify(env.WORKSPACES_DOMAIN || '')
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
}
});
