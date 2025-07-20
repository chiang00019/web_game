'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import OrderForm from '@/components/shop/OrderForm'
import { ChevronLeftIcon } from 'lucide-react'

interface Game {
  game_id: number
  game_name: string
  category?: string
  icon?: string
  is_active: boolean
}

export default function GameDetailPage() {
  const params = useParams()
  const gameId = params.game_id as string

  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/games/${gameId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('遊戲不存在')
          } else {
            setError('載入遊戲資訊失敗')
          }
          return
        }

        const gameData = await response.json()
        
        // 檢查遊戲是否啟用
        if (!gameData.is_active) {
          setError('此遊戲目前暫停服務')
          return
        }

        setGame(gameData)

      } catch (error) {
        console.error('Error fetching game:', error)
        setError('載入遊戲資訊失敗')
      } finally {
        setLoading(false)
      }
    }

    if (gameId) {
      fetchGame()
    }
  }, [gameId])

  const handleOrderCreated = (orderId: string) => {
    // 可以導向訂單確認頁面或顯示成功訊息
    console.log('Order created:', orderId)
  }

  // 載入狀態
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  // 錯誤狀態
  if (error || !game) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* 返回按鈕 */}
          <Link
            href="/shop"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-6"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            返回商店
          </Link>

          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-block">
              {error || '遊戲不存在'}
            </div>
            <div className="mt-6">
              <Link
                href="/shop"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
              >
                返回商店
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按鈕 */}
        <Link
          href="/shop"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-6"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          返回商店
        </Link>

        {/* 遊戲資訊 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* 遊戲圖片 */}
            <div className="md:flex-shrink-0">
              <div className="h-48 w-full md:w-48 relative">
                {game.icon ? (
                  <Image
                    src={game.icon}
                    alt={game.game_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {game.game_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 遊戲詳細資訊 */}
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                {game.category || '遊戲'}
              </div>
              <h1 className="mt-1 text-3xl font-bold text-gray-900">
                {game.game_name}
              </h1>
              <p className="mt-2 text-gray-600">
                歡迎來到 {game.game_name} 的儲值頁面。請選擇您需要的套餐並填寫相關資訊，我們將盡快為您處理訂單。
              </p>
              
              {/* 遊戲狀態 */}
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  服務中
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 訂單表單 */}
        <OrderForm
          gameId={gameId}
          gameName={game.game_name}
          onOrderCreated={handleOrderCreated}
        />

        {/* 注意事項 */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            📋 注意事項
          </h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• 請確保填寫正確的遊戲角色資訊，錯誤資訊可能導致儲值失敗</li>
            <li>• 訂單建立後，請依照付款說明完成付款</li>
            <li>• 完成付款後，我們將在 24 小時內處理您的訂單</li>
            <li>• 如有任何問題，請聯繫客服人員</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 