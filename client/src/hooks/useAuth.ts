'use client'

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

interface Profile {
  user_id: string
  is_admin: boolean
  user_name: string | null
  line_username: string | null
  phone_no: string | null
}

const supabase = createSupabaseClient()

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async (user: User | null) => {
    if (!user) {
      setProfile(null)
      return
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.warn('Profile fetch error:', profileError)
        throw profileError
      }
      setProfile(profileData)
    } catch (err) {
      console.error('Auth error:', err)
      setError(err instanceof Error ? err.message : '獲取個人資料時發生錯誤')
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    let authListener: { subscription: { unsubscribe: () => void } } | null = null

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (mounted) {
          const currentUser = session?.user ?? null
          setUser(currentUser)
          
          if (currentUser) {
            await fetchProfile(currentUser)
          } else {
          }
        }
        
        // 設置 auth state change 監聽器
        if (mounted) {
          const { data: listener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              
              if (!mounted) return

              const currentUser = session?.user ?? null
              setUser(currentUser)
              
              if (event === 'SIGNED_IN' && currentUser) {
                await fetchProfile(currentUser)
              } else if (event === 'SIGNED_OUT') {
                setProfile(null)
              }
            }
          )
          authListener = listener
        }
        
      } catch (err) {
        console.error('Auth initialization error:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : '認證初始化失敗')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
      authListener?.subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      // The onAuthStateChange listener will handle clearing user and profile state.
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err instanceof Error ? err.message : '登出錯誤')
    }
  }

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: !!profile?.is_admin,
    signOut,
  }
} 