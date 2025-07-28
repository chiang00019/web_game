'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'
import GameTopupTemplate from '@/components/shop/GameTopupTemplate'
import { 
  getGameConfig, 
  getGameInfo, 
  getGamePackages, 
  getPaymentMethods 
} from '@/data/mockGameConfigs'
import { Game, GameConfig, GamePackage, PaymentMethod, OrderFormData } from '@/types/gameConfig'

export default function GameDetailPage() {
  const params = useParams()
  const gameId = parseInt(params.game_id as string)

  const [game, setGame] = useState<Game | null>(null)
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null)
  const [packages, setPackages] = useState<GamePackage[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 使用 mock 資料（在實際開發中，這裡會是 API 呼叫）
        const gameInfo = getGameInfo(gameId)
        
        if (!gameInfo) {
          setError('遊戲不存在')
          return
        }

        if (!gameInfo.is_active) {
          setError('此遊戲目前暫停服務')
          return
        }

        setGame(gameInfo)
        setGameConfig(getGameConfig(gameId))
        setPackages(getGamePackages(gameId))
        setPaymentMethods(getPaymentMethods())

      } catch (error) {
        console.error('Error fetching game data:', error)
        setError('載入遊戲資訊失敗')
      } finally {
        setLoading(false)
      }
    }

    if (gameId) {
      fetchGameData()
    }
  }, [gameId])

  // 處理訂單提交
  const handleOrderSubmit = async (orderData: OrderFormData) => {
    try {
      console.log('提交訂單:', {
        gameId,
        gameName: game?.game_name,
        orderData
      })

      // 模擬 API 呼叫
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 在實際開發中，這裡會呼叫 API
      /*
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game_id: gameId,
          package_id: orderData.package_id,
          payment_method_id: orderData.payment_method_id,
          game_data: orderData.game_data,
          quantity: orderData.quantity
        }),
      })

      if (!response.ok) {
        throw new Error('訂單提交失敗')
      }

      const result = await response.json()
      console.log('訂單建立成功:', result)
      */

    } catch (error) {
      console.error('訂單提交錯誤:', error)
      throw error
    }
  }

  // 載入狀態
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f23]">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    )
  }

  // 錯誤狀態
  if (error || !game || !gameConfig) {
    return (
      <div className="min-h-screen bg-[#0f0f23]">
        <div className="container mx-auto px-4 py-8">
          {/* 返回按鈕 */}
          <Link
            href="/shop"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            返回商店
          </Link>

          <div className="text-center py-20">
            <div className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-4 rounded-lg inline-block">
              {error || '遊戲不存在'}
            </div>
            <div className="mt-6">
              <Link
                href="/shop"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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
    <div className="min-h-screen bg-[#0f0f23]">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按鈕 */}
        <Link
          href="/shop"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          返回商店
        </Link>

        {/* 遊戲資訊卡片 */}
        <div className="bg-[#2a2d4e] rounded-lg shadow-lg overflow-hidden mb-8">
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
                  <div className="h-full w-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {game.game_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 遊戲詳細資訊 */}
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-purple-400 font-semibold">
                {game.category || '遊戲'}
              </div>
              <h1 className="mt-1 text-3xl font-bold text-white">
                {game.game_name}
              </h1>
              <p className="mt-2 text-gray-300">
                {game.description || `歡迎來到 ${game.game_name} 的儲值頁面。請選擇您需要的套餐並填寫相關資訊，我們將盡快為您處理訂單。`}
              </p>
              
              {/* 遊戲狀態 */}
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                  ✅ 服務中
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 模板化儲值表單 */}
        <GameTopupTemplate
          game={game}
          gameConfig={gameConfig}
          packages={packages}
          paymentMethods={paymentMethods}
          onOrderSubmit={handleOrderSubmit}
        />

        {/* 注意事項 */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-400 mb-3">
            📋 注意事項
          </h3>
          <ul className="space-y-2 text-blue-300 text-sm">
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