'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

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

interface SimpleGameTopupTemplateProps {
  game: Game
  gameOptions: GameOption[]
  paymentMethods: PaymentMethod[]
  onOrderSubmit: (orderData: OrderFormData) => Promise<void>
}

export default function SimpleGameTopupTemplate({
  game,
  gameOptions,
  paymentMethods,
  onOrderSubmit
}: SimpleGameTopupTemplateProps) {
  const { user, loading: authLoading } = useAuth()
  
  // 表單狀態
  const [formData, setFormData] = useState({
    game_uid: '',
    game_server: '',
    game_username: '',
    note: ''
  })
  
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 表單驗證
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.game_uid.trim()) {
      newErrors.game_uid = '請輸入遊戲 UID'
    }
    
    if (!formData.game_server.trim()) {
      newErrors.game_server = '請輸入伺服器'
    }
    
    if (!formData.game_username.trim()) {
      newErrors.game_username = '請輸入角色暱稱'
    }
    
    if (!selectedPackage) {
      newErrors.package = '請選擇儲值套餐'
    }
    
    if (!selectedPaymentMethod) {
      newErrors.payment_method = '請選擇付款方式'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 處理表單提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    if (!user) {
      alert('請先登入')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await onOrderSubmit({
        game_uid: formData.game_uid,
        game_server: formData.game_server,
        game_username: formData.game_username,
        package_id: selectedPackage!,
        payment_method_id: selectedPaymentMethod!,
        note: formData.note
      })
      
      // 重置表單
      setFormData({
        game_uid: '',
        game_server: '',
        game_username: '',
        note: ''
      })
      setSelectedPackage(null)
      setSelectedPaymentMethod(null)
      setErrors({})
    } catch (error) {
      console.error('訂單提交失敗:', error)
      alert('訂單提交失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 處理輸入變更
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 清除該欄位的錯誤
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-yellow-400 mb-2">需要登入</h3>
        <p className="text-yellow-300 mb-4">請先登入才能進行儲值</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
          前往登入
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">儲值資訊</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 角色資訊 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-blue-400">角色資訊</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                遊戲 UID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.game_uid}
                onChange={(e) => handleInputChange('game_uid', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="請輸入遊戲 UID"
              />
              {errors.game_uid && (
                <p className="text-red-400 text-sm mt-1">{errors.game_uid}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                伺服器 <span className="text-red-400">*</span>
              </label>
              {game.servers && game.servers.length > 0 ? (
                <select
                  value={formData.game_server}
                  onChange={(e) => handleInputChange('game_server', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">請選擇伺服器</option>
                  {game.servers.map((server, index) => (
                    <option key={index} value={server} className="bg-gray-700 text-white">
                      {server}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.game_server}
                  onChange={(e) => handleInputChange('game_server', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="請輸入伺服器"
                />
              )}
              {errors.game_server && (
                <p className="text-red-400 text-sm mt-1">{errors.game_server}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                角色暱稱 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.game_username}
                onChange={(e) => handleInputChange('game_username', e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                placeholder="請輸入角色暱稱"
              />
              {errors.game_username && (
                <p className="text-red-400 text-sm mt-1">{errors.game_username}</p>
              )}
            </div>
          </div>
        </div>

        {/* 儲值套餐 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-blue-400">儲值套餐</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gameOptions.map((option) => (
              <div
                key={option.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPackage === option.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => {
                  setSelectedPackage(option.id)
                  if (errors.package) {
                    setErrors(prev => ({ ...prev, package: '' }))
                  }
                }}
              >
                <div className="text-white font-medium">{option.name}</div>
                <div className="text-blue-400 text-lg font-bold">NT$ {option.price}</div>
              </div>
            ))}
          </div>
          {errors.package && (
            <p className="text-red-400 text-sm">{errors.package}</p>
          )}
        </div>

        {/* 付款方式 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-blue-400">付款方式</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.payment_method_id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPaymentMethod === method.payment_method_id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => {
                  setSelectedPaymentMethod(method.payment_method_id)
                  if (errors.payment_method) {
                    setErrors(prev => ({ ...prev, payment_method: '' }))
                  }
                }}
              >
                <div className="text-white font-medium">{method.method}</div>
              </div>
            ))}
          </div>
          {errors.payment_method && (
            <p className="text-red-400 text-sm">{errors.payment_method}</p>
          )}
        </div>

        {/* 備註 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            備註（選填）
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleInputChange('note', e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="有任何特殊需求請在此說明"
            rows={3}
          />
        </div>

        {/* 提交按鈕 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {isSubmitting ? '處理中...' : '提交訂單'}
        </button>
      </form>
    </div>
  )
}