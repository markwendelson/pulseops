/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_MOCKS: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_TELEMETRY_REFRESH_INTERVAL: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
