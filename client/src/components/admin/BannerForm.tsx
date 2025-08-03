'use client'

import { useState, useEffect } from 'react'

interface Banner {
  banner_id?: string
  title: string
  image_url: string
  link_url?: string
  is_active: boolean
  display_order?: number
}

interface BannerFormProps {
  banner?: Banner
  onSave: (banner: Omit<Banner, 'banner_id'>) => void
  onCancel: () => void
}

export default function BannerForm({ banner, onSave, onCancel }: BannerFormProps) {
  const [formData, setFormData] = useState<Omit<Banner, 'banner_id'>>({
    title: '',
    image_url: '',
    link_url: '',
    is_active: true
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        image_url: banner.image_url,
        link_url: banner.link_url || '',
        is_active: banner.is_active
      })
      setImagePreview(banner.image_url)
    }
  }, [banner])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 檢查檔案大小
      if (file.size > 5 * 1024 * 1024) {
        alert('檔案大小不能超過 5MB')
        return
      }
      
      // 檢查檔案類型
      if (!file.type.startsWith('image/')) {
        alert('只能上傳圖片檔案')
        return
      }
      
      setImageFile(file)
      
      // 建立預覽
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      console.log('✅ 圖片已選擇:', file.name, '大小:', (file.size / 1024 / 1024).toFixed(2) + 'MB')
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('圖片上傳失敗')
    }
    
    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      let imageUrl = formData.image_url
      
      // 如果有新的圖片檔案，先上傳
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }
      
      const bannerData = {
        ...formData,
        image_url: imageUrl
      }
      
      onSave(bannerData)
    } catch (error) {
      console.error('Error:', error)
      alert('儲存失敗，請重試')
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
            {banner ? '編輯橫幅' : '新增橫幅'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                標題
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                橫幅圖片
              </label>
              
              {/* 圖片預覽 */}
              {imagePreview && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">圖片預覽</p>
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="橫幅預覽"
                        className="w-full h-40 object-cover rounded-md border shadow-sm"
                      />
                      {imageFile && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          新上傳
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {imageFile ? `檔案名稱: ${imageFile.name}` : '目前使用的圖片'}
                    </p>
                  </div>
                </div>
              )}
              
              {/* 檔案上傳 */}
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>✅ 支援 JPG、PNG、GIF</span>
                  <span>📏 建議尺寸 1200x400</span>
                  <span>📦 最大 5MB</span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="link_url" className="block text-sm font-medium text-gray-700">
                連結網址 (選填)
              </label>
              <input
                type="url"
                id="link_url"
                name="link_url"
                value={formData.link_url}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>


            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                啟用顯示
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? '上傳中...' : '儲存'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 