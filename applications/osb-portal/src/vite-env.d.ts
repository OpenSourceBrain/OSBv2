/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOMAIN: string
  readonly VITE_NAMESPACE: string
  readonly VITE_APP_DOMAIN: string
  readonly VITE_ACCOUNTS_API_DOMAIN: string
  readonly VITE_WORKSPACES_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
