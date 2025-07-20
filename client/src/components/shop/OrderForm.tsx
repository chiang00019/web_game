'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface GamePackage {
  package_id: number
  name: string
  description?: string
  price: number
  is_active: boolean
}

interface PaymentMethod {
  payment_method_id: number
  method: string
}

interface OrderFormProps {
  gameId: string
  gameName: string
  onOrderCreated?: (orderId: string) => void
}

interface OrderData {
  package_id: string
  payment_method_id: string
  game_uid: string
  game_server: string
  game_username: string
  note: string
}

export default function OrderForm({ gameId, gameName, onOrderCreated }: OrderFormProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [packages, setPackages] = useState<GamePackage[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<OrderData>({
    package_id: '',
    payment_method_id: '',
    game_uid: '',
    game_server: '',
    game_username: '',
    note: ''
  })

  // 獲取遊戲套餐和付款方式
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 並行獲取套餐和付款方式
        const [packagesRes, paymentMethodsRes] = await Promise.all([
          fetch(`/api/games/${gameId}/packages`),
          fetch(`/api/games/${gameId}/payment-methods`)
        ])

        if (!packagesRes.ok || !paymentMethodsRes.ok) {
          throw new Error('獲取資料失敗')
        }

        const [packagesData, paymentMethodsData] = await Promise.all([
          packagesRes.json(),
          paymentMethodsRes.json()
        ])

        setPackages(packagesData)
        setPaymentMethods(paymentMethodsData)
        
        // 自動選擇第一個套餐和付款方式
        if (packagesData.length > 0) {
          setFormData(prev => ({ ...prev, package_id: packagesData[0].package_id.toString() }))
        }
        if (paymentMethodsData.length > 0) {
          setFormData(prev => ({ ...prev, payment_method_id: paymentMethodsData[0].payment_method_id.toString() }))
        }

      } catch (error) {
        console.error('Error fetching data:', error)
        setError('載入資料失敗，請重新整理頁面')
      } finally {
        setLoading(false)
      }
    }

    if (gameId) {
      fetchData()
    }
  }, [gameId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 檢查登入狀態
    if (!user) {
      alert('請先登入才能下訂單')
      router.push('/auth')
      return
    }

    // 表單驗證
    if (!formData.package_id || !formData.payment_method_id || !formData.game_uid.trim()) {
      setError('請填寫所有必要欄位')
      return
    }

    try {
      setSubmitting(true)
      setError(null)

      const orderData = {
        game_id: gameId,
        package_id: formData.package_id,
        payment_method_id: formData.payment_method_id,
        game_uid: formData.game_uid.trim(),
        game_server: formData.game_server.trim(),
        game_username: formData.game_username.trim(),
        note: formData.note.trim()
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '建立訂單失敗')
      }

      // 訂單建立成功
      alert('訂單建立成功！請等待處理。')
      
      if (onOrderCreated) {
        onOrderCreated(result.order_id)
      }
      
      // 重置表單
      setFormData({
        package_id: packages[0]?.package_id.toString() || '',
        payment_method_id: paymentMethods[0]?.payment_method_id.toString() || '',
        game_uid: '',
        game_server: '',
        game_username: '',
        note: ''
      })

    } catch (error) {
      console.error('Error creating order:', error)
      setError(error instanceof Error ? error.message : '建立訂單失敗')
    } finally {
      setSubmitting(false)
    }
  }

  // 載入狀態
  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  // 未登入狀態
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">請先登入才能下訂單</p>
        <button
          onClick={() => router.push('/auth')}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          前往登入
        </button>
      </div>
    )
  }

  // 獲取選中的套餐資訊
  const selectedPackage = packages.find(pkg => pkg.package_id.toString() === formData.package_id)
  const selectedPaymentMethod = paymentMethods.find(pm => pm.payment_method_id.toString() === formData.payment_method_id)

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {gameName} - 儲值訂單
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 套餐選擇 */}
        <div>
          <label htmlFor="package_id" className="block text-sm font-medium text-gray-700 mb-2">
            選擇套餐 *
          </label>
          <select
            id="package_id"
            name="package_id"
            value={formData.package_id}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">請選擇套餐</option>
            {packages.map(pkg => (
              <option key={pkg.package_id} value={pkg.package_id}>
                {pkg.name} - ${pkg.price}
              </option>
            ))}
          </select>
          {selectedPackage?.description && (
            <p className="text-sm text-gray-500 mt-1">{selectedPackage.description}</p>
          )}
        </div>

        {/* 付款方式選擇 */}
        <div>
          <label htmlFor="payment_method_id" className="block text-sm font-medium text-gray-700 mb-2">
            付款方式 *
          </label>
          <select
            id="payment_method_id"
            name="payment_method_id"
            value={formData.payment_method_id}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">請選擇付款方式</option>
            {paymentMethods.map(pm => (
              <option key={pm.payment_method_id} value={pm.payment_method_id}>
                {pm.method}
              </option>
            ))}
          </select>
        </div>

        {/* 遊戲角色資訊 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="game_uid" className="block text-sm font-medium text-gray-700 mb-2">
              遊戲角色 ID *
            </label>
            <input
              type="text"
              id="game_uid"
              name="game_uid"
              value={formData.game_uid}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="請輸入遊戲角色ID"
              required
            />
          </div>

          <div>
            <label htmlFor="game_server" className="block text-sm font-medium text-gray-700 mb-2">
              伺服器
            </label>
            <input
              type="text"
              id="game_server"
              name="game_server"
              value={formData.game_server}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="請輸入伺服器名稱"
            />
          </div>
        </div>

        <div>
          <label htmlFor="game_username" className="block text-sm font-medium text-gray-700 mb-2">
            遊戲角色名稱
          </label>
          <input
            type="text"
            id="game_username"
            name="game_username"
            value={formData.game_username}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="請輸入遊戲角色名稱"
          />
        </div>

        {/* 備註 */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            備註
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            value={formData.note}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="有其他需要說明的內容請在此填寫"
          />
        </div>

        {/* 訂單摘要 */}
        {selectedPackage && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">訂單摘要</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div>遊戲：{gameName}</div>
              <div>套餐：{selectedPackage.name}</div>
              <div>金額：${selectedPackage.price}</div>
              <div>付款方式：{selectedPaymentMethod?.method}</div>
            </div>
          </div>
        )}

        {/* 提交按鈕 */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? '處理中...' : '建立訂單'}
        </button>
      </form>
    </div>
  )
} 