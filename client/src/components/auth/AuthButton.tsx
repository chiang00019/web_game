'use client'

import { useAuth } from '@/hooks/useAuth'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import { createSupabaseClient } from '@/utils/supabase/client'
import { useEffect } from 'react'

export default function AuthButton() {
  const {profile, loading } = useAuth()
  const supabase = createSupabaseClient()

  if (loading) {
    return (
      <div className="animate-pulse bg-[#2a2d4e] h-8 w-20 rounded"></div>
    )
  }

  if (profile) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-white">{profile.user_name}</span>
        <LogoutButton />
      </div>
    )
  }

  return <LoginButton />
} 