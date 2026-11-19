import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;
let configuredUrl = '';
let configuredAnonKey = '';

export function normalizeSupabaseUrl(rawUrl?: string): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    return parsed.origin;
  } catch {
    return trimmed.replace(/\/(rest|auth|storage|functions)\/v1\/?.*$/i, '').replace(/\/+$/, '');
  }
}

const DEFAULT_SUPABASE_URL = 'https://leawuzhjkuzwgzdduwzq.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_JCsq4SAwU3Lw9265lJ8maw_t9pRSS4I';

configuredUrl = normalizeSupabaseUrl(
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL
);
configuredAnonKey = (
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_SUPABASE_ANON_KEY
).trim();

export function initSupabaseClient(url?: string, anonKey?: string): SupabaseClient | null {
  const nextUrl = normalizeSupabaseUrl(url) || configuredUrl;
  const nextKey = (anonKey || configuredAnonKey || '').trim();
  if (!nextUrl || !nextKey) return null;

  if (!client || nextUrl !== configuredUrl || nextKey !== configuredAnonKey) {
    configuredUrl = nextUrl;
    configuredAnonKey = nextKey;
    client = createClient(nextUrl, nextKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return client;
}

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;
  return initSupabaseClient();
}

export function isSupabaseConfigured(): boolean {
  return Boolean(configuredUrl && configuredAnonKey);
}
