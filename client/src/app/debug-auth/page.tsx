'use client'

import { useState, useEffect } from 'react'
import supabase from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js'

interface Profile {
  user_id: string
  is_admin: boolean
  user_name: string | null
  line_username: string | null
  phone_no: string | null
}

export default function DebugAuthPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  
  const fetchAuthData = async () => {
    try {
      setLoading(true)
      setAuthError(null)
      setProfileError(null)
      
      // 獲取認證狀態
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        setAuthError(authError.message)
      } else {
        setUser(user)
      }
      
      // 獲取 profile
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (error) {
          setProfileError(error.message)
        } else {
          setProfile(data)
        }
      }
    } catch (error) {
      console.error('獲取認證數據時發生錯誤:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthData()
  }, [])

  if (loading) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">認證狀態診斷</h1>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>正在載入認證資訊...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">認證狀態診斷</h1>
        
        <div className="grid gap-6">
          {/* 認證狀態 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">認證狀態</h2>
            <div className="space-y-2">
              <div>
                <strong>是否登入：</strong>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user ? '已登入' : '未登入'}
                </span>
              </div>
              {authError && (
                <div>
                  <strong>認證錯誤：</strong>
                  <span className="ml-2 text-red-600">{authError}</span>
                </div>
              )}
            </div>
          </div>

          {/* 用戶信息 */}
          {user && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">用戶信息</h2>
              <div className="space-y-2">
                <div><strong>用戶 ID：</strong> {user.id}</div>
                <div><strong>Email：</strong> {user.email}</div>
                <div><strong>創建時間：</strong> {user.created_at}</div>
                <div><strong>最後登入：</strong> {user.last_sign_in_at || '未知'}</div>
                <div><strong>Email 已驗證：</strong> {user.email_confirmed_at ? '是' : '否'}</div>
                <div>
                  <strong>用戶元數據：</strong>
                  <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-auto">
                    {JSON.stringify(user.user_metadata, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Profile 信息 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Profile 信息</h2>
            {user ? (
              <div className="space-y-2">
                {profileError ? (
                  <div>
                    <strong>Profile 錯誤：</strong>
                    <span className="ml-2 text-red-600">{profileError}</span>
                  </div>
                ) : profile ? (
                  <div>
                    <div><strong>用戶名：</strong> {profile.user_name || '未設定'}</div>
                    <div>
                      <strong>是否管理員：</strong>
                      <span className={`ml-2 px-2 py-1 rounded text-sm ${profile.is_admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                        {profile.is_admin ? '是' : '否'}
                      </span>
                    </div>
                    <div><strong>LINE 用戶名：</strong> {profile.line_username || '未設定'}</div>
                    <div><strong>電話：</strong> {profile.phone_no || '未設定'}</div>
                    <div>
                      <strong>完整 Profile：</strong>
                      <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-auto">
                        {JSON.stringify(profile, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div>Profile 不存在</div>
                )}
              </div>
            ) : (
              <div>請先登入以查看 Profile 信息</div>
            )}
          </div>

          {/* 操作按鈕 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">快速操作</h2>
            <div className="flex flex-wrap gap-4">
              <a 
                href="/auth" 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                前往登入頁面
              </a>
              <a 
                href="/admin" 
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                前往管理員頁面
              </a>
              <a 
                href="/" 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                回到首頁
              </a>
              <button 
                onClick={() => window.location.reload()}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                刷新頁面
              </button>
              <button 
                onClick={fetchAuthData}
                disabled={loading}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? '重新載入中...' : '重新載入認證狀態'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 