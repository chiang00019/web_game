'use client'

import AdminGuard from '@/components/admin/AdminGuard'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

function AdminDashboard() {
  const { user, profile } = useAuth()

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-[#2a2d4e] shadow-lg rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">管理員儀表板</h1>
                <p className="mt-1 text-sm text-gray-300">
                  歡迎回來，{profile?.user_name || user?.email}
                </p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  回到首頁
                </Link>
                <Link
                  href="/debug-auth"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  認證狀態
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-[#2a2d4e] overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">G</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      遊戲管理
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      管理遊戲和套餐
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/games"
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                  前往管理 →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2d4e] overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">O</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      訂單管理
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      處理客戶訂單
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/orders"
                  className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                >
                  前往管理 →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2d4e] overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">B</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      橫幅管理
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      管理首頁橫幅
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/banners"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  前往管理 →
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-[#2a2d4e] overflow-hidden shadow-lg rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">P</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      付款方式
                    </dt>
                    <dd className="text-lg font-medium text-white">
                      管理付款方式
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href="/admin/payments"
                  className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                >
                  前往管理 →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#2a2d4e] shadow-lg rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-white mb-4">
              快速操作
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <Link
                href="/admin/games/new"
                className="flex flex-col items-center p-4 bg-[#1a1b2e] border border-gray-600 rounded-lg hover:bg-[#323659] transition-colors"
              >
                <div className="text-purple-400 mb-2">
                  <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">新增遊戲</span>
              </Link>

              <Link
                href="/admin/orders"
                className="flex flex-col items-center p-4 bg-[#1a1b2e] border border-gray-600 rounded-lg hover:bg-[#323659] transition-colors"
              >
                <div className="text-green-400 mb-2">
                  <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">查看訂單</span>
              </Link>

              <Link
                href="/admin/orders?status=pending"
                className="flex flex-col items-center p-4 bg-[#1a1b2e] border border-gray-600 rounded-lg hover:bg-[#323659] transition-colors"
              >
                <div className="text-orange-400 mb-2">
                  <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">待處理訂單</span>
              </Link>

              <Link
                href="/admin/games"
                className="flex flex-col items-center p-4 bg-[#1a1b2e] border border-gray-600 rounded-lg hover:bg-[#323659] transition-colors"
              >
                <div className="text-blue-400 mb-2">
                  <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">遊戲管理</span>
              </Link>

              <Link
                href="/admin/banners/new"
                className="flex flex-col items-center p-4 bg-[#1a1b2e] border border-gray-600 rounded-lg hover:bg-[#323659] transition-colors"
              >
                <div className="text-yellow-400 mb-2">
                  <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">新增橫幅</span>
              </Link>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-[#2a2d4e] shadow-lg rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-white mb-4">
              系統資訊
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-400">管理員用戶</dt>
                <dd className="mt-1 text-sm text-white">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">用戶名</dt>
                <dd className="mt-1 text-sm text-white">{profile?.user_name || '未設定'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">管理員權限</dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600 text-green-100">
                    已啟用
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-400">最後登入</dt>
                <dd className="mt-1 text-sm text-white">
                  {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('zh-TW') : '未知'}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  )
}
