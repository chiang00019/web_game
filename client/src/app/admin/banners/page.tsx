'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import AdminGuard from '@/components/admin/AdminGuard'
import BannerForm from '@/components/admin/BannerForm'

interface Banner {
  id: string
  title: string
  image_url: string
  link_url?: string
  is_active: boolean
  display_order: number
  created_at: string
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/banners')
      const data = await response.json()
      setBanners(data)
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (bannerData: Omit<Banner, 'id' | 'created_at'>) => {
    try {
      if (selectedBanner) {
        // Update existing banner
        const response = await fetch(`/api/banners/${selectedBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bannerData),
        })
        if (!response.ok) throw new Error('Failed to update banner')
      } else {
        // Create new banner
        const response = await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bannerData),
        })
        if (!response.ok) throw new Error('Failed to create banner')
      }
      
      fetchBanners()
      setIsFormOpen(false)
      setSelectedBanner(null)
    } catch (error) {
      console.error('Error saving banner:', error)
      alert('儲存失敗，請重試')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個橫幅嗎？')) return

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete banner')
      fetchBanners()
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('刪除失敗，請重試')
    }
  }

  const openForm = (banner?: Banner) => {
    setSelectedBanner(banner || null)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedBanner(null)
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">橫幅管理</h1>
                  <p className="mt-1 text-sm text-gray-600">
                    管理網站首頁的橫幅廣告
                  </p>
                </div>
                <button
                  onClick={() => openForm()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  新增橫幅
                </button>
              </div>
            </div>
          </div>

          {/* Banners List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {banners.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">尚未建立任何橫幅</p>
                    </div>
                  ) : (
                    banners.map((banner) => (
                      <div key={banner.id} className="border rounded-lg p-4 flex items-center space-x-4">
                        <Image
                          src={banner.image_url}
                          alt={banner.title}
                          width={96} // Corresponds to w-24 (96px)
                          height={64} // Corresponds to h-16 (64px)
                          className="object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{banner.title}</h3>
                          <p className="text-sm text-gray-500">順序: {banner.display_order}</p>
                          <p className="text-sm text-gray-500">
                            狀態: {banner.is_active ? '啟用' : '停用'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openForm(banner)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            刪除
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banner Form Modal */}
        {isFormOpen && (
          <BannerForm
            banner={selectedBanner || undefined}
            onSave={handleSave}
            onCancel={closeForm}
          />
        )}
      </div>
    </AdminGuard>
  )
} 