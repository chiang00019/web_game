'use client'

import { useAuth } from '@/hooks/useAuth'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'

export default function AuthButton() {
  const {profile, loading } = useAuth()

  // 如果正在載入，顯示載入圖示；如果沒有 profile，顯示登入按鈕
  if (loading) {
    return (
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
    )
  }

  if (!profile) {
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