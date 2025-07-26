'use client'

import { useState, useEffect } from 'react'
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
  
  useEffect(() => {
    let mounted = true

      // 獲取當前用戶和 profile
    const fetchProfile = async (user: User | null) => {
      try {
        if (!mounted) return
        setLoading(true)
        setError(null)
        
        // 只在有 user 時獲取 profile
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (!mounted) return
          if (!profileError && profile) {
            setProfile(profile)
          } else {
            console.warn('Profile fetch error:', profileError)
            // 不拋出錯誤，因為 profile 可能不存在（新用戶）
          }
        } else {
          console.error('no user')
          setProfile(null)
        }
      } catch (err) {
        console.error('Auth error:', err)
        setError(err instanceof Error ? err.message : '認證錯誤')
        setUser(null)
        setProfile(null)
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        fetchProfile(session.user)
      }
    }

    fetchSession()

    return () => {
      mounted = false
    }
  }, [])

  const signOut = async () => {
    try {
      setLoading(true)
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      console.warn('signOut')
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err instanceof Error ? err.message : '登出錯誤')
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    profile,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: !!profile?.is_admin,
    signOut
  }
} 