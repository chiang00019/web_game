'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'
import SimpleGameTopupTemplate from '@/components/shop/SimpleGameTopupTemplate'
import { createSupabaseClient } from '@/utils/supabase/client'

interface Game {
  id: number
  name: string
  description?: string
  icon_path?: string
  servers?: string[]
  is_active: boolean
}

interface GameOption {
  id: number
  game_id: number
  name: string
  icon_path?: string
  price: number
}

interface PaymentMethod {
  payment_method_id: number
  method: string
}

interface OrderFormData {
  game_uid: string
  game_server: string
  game_username: string
  package_id: number
  payment_method_id: number
  note?: string
}

export default function GameDetailPage() {
  const params = useParams()
  const gameId = parseInt(params.game_id as string)

  const [game, setGame] = useState<Game | null>(null)
  const [gameOptions, setGameOptions] = useState<GameOption[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadGameData = async () => {
      try {
        setLoading(true)
        const supabase = createSupabaseClient()
        
        // 載入遊戲基本資料
        const { data: gameData, error: gameError } = await supabase
          .from('games')
          .select('*')
          .eq('id', gameId)
          .eq('is_active', true)
          .single()

        if (gameError || !gameData) {
          setError('找不到指定的遊戲或遊戲已停用')
          return
        }

        // 載入遊戲選項
        const { data: optionsData, error: optionsError } = await supabase
          .from('game_options')
          .select('*')
          .eq('game_id', gameId)
          .order('price', { ascending: true })

        if (optionsError) {
          console.error('載入遊戲選項失敗:', optionsError)
          setGameOptions([])
        } else {
          setGameOptions(optionsData || [])
        }

        // 載入支付方式
        const { data: paymentData, error: paymentError } = await supabase
          .from('payment_method')
          .select('*')

        if (paymentError) {
          console.error('載入支付方式失敗:', paymentError)
          setPaymentMethods([])
        } else {
          setPaymentMethods(paymentData || [])
        }

        setGame(gameData)
      } catch (err) {
        console.error('載入遊戲數據失敗:', err)
        setError('載入遊戲數據失敗，請稍後再試')
      } finally {
        setLoading(false)
      }
    }

    if (gameId) {
      loadGameData()
    }
  }, [gameId])

  // 處理訂單提交
  const handleOrderSubmit = async (orderData: OrderFormData) => {
    try {
      const supabase = createSupabaseClient()
      
      // 獲取當前用戶
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        alert('請先登入')
        return
      }

      // 提交訂單
      const { data, error } = await supabase
        .from('order')
        .insert([{
          user_id: user.id,
          game_id: gameId,
          package_id: orderData.package_id,
          payment_method_id: orderData.payment_method_id,
          game_uid: orderData.game_uid,
          game_server: orderData.game_server,
          game_username: orderData.game_username,
          note: orderData.note,
          status: 'pending'
        }])
        .select()

      if (error) {
        console.error('訂單提交失敗:', error)
        throw new Error('訂單提交失敗，請稍後再試')
      }

      alert('訂單提交成功！')
      console.log('訂單已建立:', data)
    } catch (error) {
      console.error('訂單提交失敗:', error)
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
  if (error || !game) {
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
                      {game.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 遊戲詳細資訊 */}
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-purple-400 font-semibold">
                遊戲
              </div>
              <h1 className="mt-1 text-3xl font-bold text-white">
                {game.name}
              </h1>
              <p className="mt-2 text-gray-300">
                {game.description || `歡迎來到 ${game.name} 的儲值頁面。請選擇您需要的套餐並填寫相關資訊，我們將盡快為您處理訂單。`}
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
        <SimpleGameTopupTemplate
          game={game}
          gameOptions={gameOptions}
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