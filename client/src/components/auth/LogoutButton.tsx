
'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const { signOut, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="text-white hover:text-gray-300 disabled:opacity-50"
    >
      {loading ? '...' : '登出'}
    </button>
  )
}
