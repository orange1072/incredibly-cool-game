import { createClient } from '@supabase/supabase-js';

// Type declaration for Node.js process in case it's available at runtime
declare const process: { env: Record<string, string | undefined> } | undefined;

// Check both build-time (import.meta.env) and runtime (process.env) environment variables
// This is necessary for SSR where import.meta.env might not be available at runtime
const getEnvVar = (key: string): string | undefined => {
  // First try import.meta.env (build-time, works in browser and Vite SSR)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const value = (import.meta.env as Record<string, string | undefined>)[key];
    if (value) return value;
  }
  // Then try runtime-injected env from SSR HTML (browser)
  const appEnv = (globalThis as any)?.APP_ENV as Record<string, string | undefined> | undefined;
  const injected = appEnv?.[key];
  if (injected) return injected;
  // Fallback to process.env (runtime, works in Node.js SSR)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY');

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Vite Supabase env variables are missing');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
