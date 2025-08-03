'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import AdminGuard from '@/components/admin/AdminGuard'
import BannerForm from '@/components/admin/BannerForm'

interface Banner {
  banner_id: string
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/banners')
      const data = await response.json()
      // 按 display_order 排序，如果沒有則按建立時間排序
      const sortedBanners = data.sort((a: Banner, b: Banner) => {
        if (a.display_order && b.display_order) {
          return a.display_order - b.display_order
        }
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })
      setBanners(sortedBanners)
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (bannerData: Omit<Banner, 'banner_id' | 'created_at'>) => {
    try {
      if (selectedBanner) {
        // Update existing banner
        const response = await fetch(`/api/banners/${selectedBanner.banner_id}`, {
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

  const handleDelete = async (banner_id: string) => {
    if (!confirm('確定要刪除這個橫幅嗎？')) return

    try {
      const response = await fetch(`/api/banners/${banner_id}`, {
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

  // 拖拉排序功能
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    const newBanners = [...banners]
    const draggedBanner = newBanners[draggedIndex]
    
    // 移除被拖拉的項目
    newBanners.splice(draggedIndex, 1)
    // 插入到新位置
    newBanners.splice(dropIndex, 0, draggedBanner)
    
    // 更新 display_order
    const updatedBanners = newBanners.map((banner, index) => ({
      ...banner,
      display_order: index + 1
    }))
    
    setBanners(updatedBanners)
    setDraggedIndex(null)
    
    // 批量更新順序到後端
    try {
      await updateBannerOrder(updatedBanners)
    } catch (error) {
      console.error('Error updating banner order:', error)
      alert('更新順序失敗，請重試')
      fetchBanners() // 重新載入資料
    }
  }

  const updateBannerOrder = async (updatedBanners: Banner[]) => {
    const response = await fetch('/api/banners/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ banners: updatedBanners }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update banner order')
    }
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
                    管理網站首頁的橫幅廣告，可拖拉調整顯示順序
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
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        提示：點擊左側的拖拉圖示並拖動來調整橫幅顯示順序
                      </p>
                    </div>
                  )}
                  {banners.length > 0 && (
                    banners.map((banner, index) => (
                      <div 
                        key={banner.banner_id} 
                        className={`border rounded-lg p-4 flex items-center space-x-4 transition-all duration-200 ${
                          draggedIndex === index 
                            ? 'opacity-50 scale-95 border-blue-300 shadow-lg' 
                            : 'hover:shadow-md hover:border-gray-300'
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        {/* 拖拉圖示 */}
                        <div 
                          className="flex flex-col items-center justify-center cursor-move text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-md hover:bg-gray-100"
                          title="拖拉以調整順序"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                          </svg>
                          <span className="text-xs mt-1 font-medium">#{index + 1}</span>
                        </div>
                        
                        <Image
                          src={banner.image_url}
                          alt={banner.title}
                          width={96} // Corresponds to w-24 (96px)
                          height={64} // Corresponds to h-16 (64px)
                          className="object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{banner.title}</h3>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm text-gray-500">
                              狀態: {banner.is_active ? '啟用' : '停用'}
                            </p>
                            <p className="text-sm text-gray-500">
                              順序: {banner.display_order || index + 1}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500">
                            建立時間: {new Date(banner.created_at).toLocaleDateString('zh-TW')}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openForm(banner)}
                            className="text-indigo-600 hover:text-indigo-900 px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors"
                          >
                            編輯
                          </button>
                          <button
                            onClick={() => handleDelete(banner.banner_id)}
                            className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
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