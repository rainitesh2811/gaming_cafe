import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing public Supabase environment variables')
}

const browserStorage = {
  getItem(key: string) {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key)
  },
  setItem(key: string, value: string) {
    if (typeof window !== 'undefined') window.localStorage.setItem(key, value)
  },
  removeItem(key: string) {
    if (typeof window !== 'undefined') window.localStorage.removeItem(key)
  },
}

export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'levelup-supabase-auth',
    storage: browserStorage,
  },
})