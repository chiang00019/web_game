'use client'

import { useAuth } from '@/hooks/useAuth'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'

export default function AuthButton() {
  const {profile, loading } = useAuth()

  // 如果正在載入或沒有 profile，都顯示 LoginButton
  if (loading || !profile) {
    return <LoginButton />
  }

  // 只有當確定有 profile 時才顯示用戶資訊和登出按鈕
  return (
    <div className="flex items-center gap-4">
      <span className="text-white">{profile.user_name}</span>
      <LogoutButton />
    </div>
  )
} 