import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  
  return {
    publicDir: 'public',
    build: {
      outDir: 'public',
      sourcemap: true,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: '[name].[hash].js',
          chunkFileNames: '[name].[hash].js',
          assetFileNames: '[name].[hash][extname]'
        }
      }
    },
    plugins: [
      react(),
    ],
    server: {
      port: 3000,
      proxy: {
        '/proxy/workspaces': {
          target: env.VITE_WORKSPACES_DOMAIN || 
                 env.VITE_DOMAIN?.replace('://', '://workspaces.'),
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/proxy\/workspaces/, '')
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  };
});