'use client'

import { useEffect } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'

export default function JWTDebug() {
  useEffect(() => {
    const checkJWT = async () => {
      const supabase = createSupabaseClient()
      
      // 檢查當前的 session
      const { data: { session }, error } = await supabase.auth.getSession()
      console.log('Current session:', session)
      console.log('Session error:', error)
      
      if (session?.access_token) {
        // 解析 JWT 來檢查過期時間
        try {
          const payload = JSON.parse(atob(session.access_token.split('.')[1]))
          const now = Math.floor(Date.now() / 1000)
          const exp = payload.exp
          
          console.log('JWT expires at:', new Date(exp * 1000))
          console.log('Current time:', new Date(now * 1000))
          console.log('JWT expired:', now > exp)
          console.log('Time until expiry:', exp - now, 'seconds')
        } catch (e) {
          console.error('Failed to parse JWT:', e)
        }
      }
    }
    
    checkJWT()
  }, [])

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h3>JWT Debug</h3>
      <p>檢查 Console 查看 JWT 狀態</p>
    </div>
  )
}