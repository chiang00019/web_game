'use client'

import { useEffect, useState } from 'react'
import { createSupabaseClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

export default function TestPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testGetUser = async () => {
      console.log('=== TEST PAGE: Starting getUser test ===')
      
      try {
        setLoading(true)
        setError(null)
        
        const supabase = createSupabaseClient()
        console.log('TEST: Supabase client created')
        
        console.log('TEST: Calling getUser()...')
        const { data: { user }, error } = await supabase.auth.getUser()
        
        console.log('TEST: getUser() completed')
        console.log('TEST: User:', user)
        console.log('TEST: Error:', error)
        
        if (error) {
          setError(error.message)
        } else {
          setUser(user)
        }
        
      } catch (err) {
        console.error('TEST: Exception occurred:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    testGetUser()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test Page - getUser() 功能測試</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">測試結果：</h2>
        
        {loading && (
          <div className="text-yellow-400">
            🔄 正在測試 getUser()...
          </div>
        )}
        
        {error && (
          <div className="text-red-400">
            ❌ 錯誤: {error}
          </div>
        )}
        
        {!loading && !error && (
          <div className="text-green-400">
            ✅ getUser() 成功執行！
            
            {user ? (
              <div className="mt-4 bg-gray-700 p-4 rounded">
                <h3 className="font-semibold mb-2">用戶資訊：</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="mt-4 text-gray-400">
                沒有登入的用戶
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-400">
          💡 請檢查瀏覽器 Console 以查看詳細的調試訊息
        </div>
      </div>
    </div>
  )
}