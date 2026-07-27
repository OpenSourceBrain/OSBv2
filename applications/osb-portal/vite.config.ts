import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Default DSN only for production builds; leave it empty under the dev server
  // (command === 'serve') so running locally never wires up Sentry.
  const defaultSentryDsn = command === 'build'
    ? 'https://fc2326dc50e34ac2b7188130e173f002@o4506739169951744.ingest.us.sentry.io/4506758817382400'
    : ''
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
    'process.env.VITE_WORKSPACES_DOMAIN': JSON.stringify(env.WORKSPACES_DOMAIN || ''),
    // Sentry configuration, baked in at build time from the deploy values
    // (values.yaml `sentry:` block). Overridable via SENTRY_* build env vars.
    // An empty SENTRY_DSN disables Sentry (see ErrorHandleService).
    'import.meta.env.VITE_SENTRY_DSN': JSON.stringify(env.SENTRY_DSN ?? defaultSentryDsn),
    'import.meta.env.VITE_SENTRY_SAMPLE_RATE': JSON.stringify(env.SENTRY_SAMPLE_RATE || '1.0'),
    'import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE': JSON.stringify(env.SENTRY_TRACES_SAMPLE_RATE || '0.05')
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
}
});
