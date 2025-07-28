import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null

export function createSupabaseClient(): SupabaseClient {
  if (!supabase) {
    supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          // 自動刷新 token
          autoRefreshToken: true,
          // 當 token 過期時自動重試
          persistSession: true,
          // 檢測 focus 時刷新 session
          detectSessionInUrl: true,
          // 設置較短的刷新間隔
          flowType: 'pkce'
        }
      }
    )
  }
  return supabase
}
