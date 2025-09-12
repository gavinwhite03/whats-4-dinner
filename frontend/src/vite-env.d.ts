/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SPOONACULAR_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}