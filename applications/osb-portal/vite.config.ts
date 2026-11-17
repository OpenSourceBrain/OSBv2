import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {
  const env = loadEnv(mode, process.cwd(), '')
  // The same built image is deployed to every environment, so the real DSN can't
  // be baked in at build time - it's resolved at container startup (entrypoint.sh)
  // from the SENTRY_DSN pod env var, which is only set for the prod deployment
  // (deploy/values-prod.yaml). Leave the placeholder out entirely under the dev
  // server (command === 'serve') so running locally never wires up Sentry.
  const defaultSentryDsn = command === 'build' ? '__SENTRY_DSN__' : ''
  const proxyTarget = env.DOMAIN || "";
  const osbDomain = env && env.DOMAIN ? env.DOMAIN : 'localhost:8000';
  const replaceHost = (uri, appName) => uri.replace("://", "://" + appName + ".");

  return {
  plugins: [react()],
  // Static assets (images, favicon, splash, silent-check-sso.html, api-mocks) live
  // under src/assets and are served from the root: /images/banner.png etc.
  // The pre-Vite webpack build copied src/assets -> public with CopyPlugin; using it
  // as Vite's publicDir keeps the same URLs in dev and in the build output.
  publicDir: 'src/assets',
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
    // The DSN placeholder is resolved per-deployment at container startup
    // (see entrypoint.sh); an empty SENTRY_DSN disables Sentry (see ErrorHandleService).
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
