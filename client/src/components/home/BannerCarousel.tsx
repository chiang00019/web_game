'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Banner {
  banner_id: string
  title: string
  image_url: string
  link_url?: string
  is_active: boolean
  display_order: number
  created_at: string
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        )
      }, 5000) // 每5秒切換一次

      return () => clearInterval(interval)
    }
  }, [banners.length])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners')
      if (response.ok) {
        const data = await response.json()
        // 只顯示啟用的 banner，並按 display_order 排序
        const activeBanners = data
          .filter((banner: Banner) => banner.is_active)
          .sort((a: Banner, b: Banner) => (a.display_order || 999) - (b.display_order || 999))
        setBanners(activeBanners)
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1)
  }

  const handleBannerClick = (banner: Banner) => {
    if (banner.link_url) {
      window.open(banner.link_url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="relative w-full h-64 md:h-96 bg-gray-200 rounded-lg animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">載入中...</div>
        </div>
      </div>
    )
  }

  if (banners.length === 0) {
    return null // 沒有 banner 時不顯示
  }

  return (
    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8">
      {/* Banner 圖片 */}
      <div className="relative w-full h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.banner_id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className={`relative w-full h-full ${
                banner.link_url ? 'cursor-pointer' : ''
              }`}
              onClick={() => handleBannerClick(banner)}
            >
              <Image
                src={banner.image_url}
                alt={banner.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* 漸層遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              
              {/* Banner 標題 */}
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-xl md:text-3xl font-bold drop-shadow-lg">
                  {banner.title}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 左右箭頭 */}
      {banners.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            aria-label="上一張"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200"
            aria-label="下一張"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 指示點 */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`前往第 ${index + 1} 張`}
            />
          ))}
        </div>
      )}
    </div>
  )
}