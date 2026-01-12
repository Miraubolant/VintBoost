/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SCRAPER_API_URL: string
  readonly VITE_SCRAPER_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
