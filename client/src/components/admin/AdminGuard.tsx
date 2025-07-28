'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'


interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AdminGuard({ children, fallback }: AdminGuardProps) {
  const { user, profile, loading, isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()

  // 添加調試日誌
  console.log('🔍 AdminGuard 狀態檢查:', {
    loading,
    isAuthenticated,
    isAdmin,
    userEmail: user?.email,
    profileAdmin: profile?.is_admin
  })

  console.log('loading', loading) 
  console.log('user_id', user?.id)
  console.log('profile', profile)

  useEffect(() => {
    console.log('AdminGuard useEffect 觸發:', { loading, isAuthenticated, isAdmin })
    
    if (!loading) {
      console.log('載入完成，開始權限檢查')
      
      // 添加延遲，避免在認證狀態還在同步時就重定向
      const timeoutId = setTimeout(() => {
        if (!isAuthenticated) {
          console.log('未認證，重定向到登入頁面')
          router.push('/auth')
          return
        }

        if (!isAdmin) {
          console.log('非管理員，重定向到首頁')
          router.push('/')
          return
        }

        console.log('管理員權限驗證通過')
      }, 100) // 100ms 延遲

      return () => clearTimeout(timeoutId)
    } else {
      console.log('仍在載入中...')
    }
  }, [loading, isAuthenticated, isAdmin, router])

  // 顯示載入狀態
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            載入中...
          </h2>
          <p className="mt-2 text-gray-600">
            正在載入用戶資訊
          </p>
          <div className="mt-4 text-xs text-gray-500">
            <p>調試資訊:</p>
            <p>loading: {loading.toString()}</p>
            <p>isAuthenticated: {isAuthenticated.toString()}</p>
            <p>isAdmin: {isAdmin.toString()}</p>
            <p>user_email: {user?.email || 'null'}</p>
            <p>profile.is_admin: {profile?.is_admin?.toString() || 'null'}</p>
          </div>
        </div>
      </div>
    )
  }

  // 如果未認證或非管理員，顯示 fallback 或空白
  if (!isAuthenticated || !isAdmin) {
    return fallback || null
  }

  // 如果一切正常，渲染子組件
  console.log('渲染管理員頁面')
  return <>{children}</>
} 