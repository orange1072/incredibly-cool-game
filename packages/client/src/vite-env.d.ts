/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Declaration for @supabase/supabase-js to suppress TypeScript errors when module is not found locally
declare module '@supabase/supabase-js' {
  export function createClient(url: string, key: string): any;
}

declare global {
  // Injected by SSR in `server/index.ts`
  // eslint-disable-next-line no-var
  var APP_ENV:
    | {
        VITE_SUPABASE_URL?: string;
        VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY?: string;
      }
    | undefined;
}
