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
    setLoading(true)
    setError(null)
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 means no rows found, which is not a critical error for a new user.
        console.warn('Profile fetch error:', profileError)
        throw profileError
      }
      setProfile(profileData)
    } catch (err) {
      console.error('Auth error:', err)
      setError(err instanceof Error ? err.message : '獲取個人資料時發生錯誤')
      setProfile(null) // Clear profile on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    // Get initial user data to prevent flicker
    const getInitialUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        await fetchProfile(user);
        setLoading(false);
    }
    getInitialUser();


    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (event === 'SIGNED_IN') {
          await fetchProfile(currentUser)
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => {
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