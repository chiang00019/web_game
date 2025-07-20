'use client'

import { useAuth } from '@/hooks/useAuth'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'

export default function AuthButton() {
  const { profile, loading } = useAuth()

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