'use client'

import { useState, useEffect } from 'react'
import supabase from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

interface Profile {
  user_id: string
  is_admin: boolean
  user_name: string | null
  line_username: string | null
  phone_no: string | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // 獲取當前用戶和 profile
    const fetchUser = async () => {
      try {
        setLoading(true)
        setError(null)

        // 獲取用戶
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          throw userError
        }

        setUser(user)
        
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()


          if (profileError) {
            console.warn('Profile fetch error:', profileError)
            // 不拋出錯誤，因為 profile 可能不存在（新用戶）
          } else {
            setProfile(profile)
          }
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error('Auth error:', err)
        setError(err instanceof Error ? err.message : '認證錯誤')
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // 監聽認證狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (session?.user) {
          setUser(session.user)
          
          // 重新獲取 profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single()

          if (!profileError && profile) {
            setProfile(profile)
          }
        } else {
          setUser(null)
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

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