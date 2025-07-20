'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import DynamicGameOptions from './DynamicGameOptions'
import { 
  Game, 
  GameConfig, 
  GamePackage, 
  PaymentMethod, 
  GameFormData, 
  OrderFormData 
} from '@/types/gameConfig'

interface GameTopupTemplateProps {
  game: Game
  gameConfig: GameConfig
  packages: GamePackage[]
  paymentMethods: PaymentMethod[]
  onOrderSubmit: (orderData: OrderFormData) => Promise<void>
}

export default function GameTopupTemplate({
  game,
  gameConfig,
  packages,
  paymentMethods,
  onOrderSubmit
}: GameTopupTemplateProps) {
  const { user, loading: authLoading } = useAuth()
  
  // 表單狀態
  const [formData, setFormData] = useState<GameFormData>({})
  const [selectedPackage, setSelectedPackage] = useState<string>('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [quantity, setQuantity] = useState<number>(1)
  
  // UI 狀態
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // 初始化預設值
  useEffect(() => {
    if (packages.length > 0 && !selectedPackage) {
      setSelectedPackage(packages[0].package_id.toString())
    }
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      setSelectedPaymentMethod(paymentMethods[0].payment_method_id.toString())
    }
  }, [packages, paymentMethods, selectedPackage, selectedPaymentMethod])

  // 處理動態欄位變更
  const handleFieldChange = (key: string, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
    
    // 清除該欄位的錯誤
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  // 驗證表單
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // 驗證套餐選擇
    if (!selectedPackage) {
      newErrors.package = '請選擇儲值套餐'
    }

    // 驗證付款方式
    if (!selectedPaymentMethod) {
      newErrors.payment_method = '請選擇付款方式'
    }

    // 驗證動態欄位
    gameConfig.fields.forEach(field => {
      const value = formData[field.field_key]
      
      if (field.is_required && (!value || value === '')) {
        newErrors[field.field_key] = `${field.field_label}為必填項目`
        return
      }

      if (!field.validation || !value) return

      const validation = field.validation

      // 文字長度驗證
      if (validation.minLength && String(value).length < validation.minLength) {
        newErrors[field.field_key] = `${field.field_label}至少需要 ${validation.minLength} 個字符`
      }
      
      if (validation.maxLength && String(value).length > validation.maxLength) {
        newErrors[field.field_key] = `${field.field_label}不能超過 ${validation.maxLength} 個字符`
      }

      // 數字範圍驗證
      if (field.field_type === 'number') {
        const numValue = Number(value)
        if (validation.min && numValue < validation.min) {
          newErrors[field.field_key] = `${field.field_label}不能小於 ${validation.min}`
        }
        if (validation.max && numValue > validation.max) {
          newErrors[field.field_key] = `${field.field_label}不能大於 ${validation.max}`
        }
      }

      // 正則表達式驗證
      if (validation.pattern && !new RegExp(validation.pattern).test(String(value))) {
        newErrors[field.field_key] = `${field.field_label}格式不正確`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 提交訂單
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      const orderData: OrderFormData = {
        package_id: selectedPackage,
        payment_method_id: selectedPaymentMethod,
        game_data: formData,
        quantity
      }

      await onOrderSubmit(orderData)
      setSuccess(true)
      
      // 清空表單
      setFormData({})
      setSelectedPackage(packages[0]?.package_id.toString() || '')
      setSelectedPaymentMethod(paymentMethods[0]?.payment_method_id.toString() || '')
      setQuantity(1)
      
    } catch (error) {
      console.error('訂單提交失敗:', error)
      setErrors({ submit: '訂單提交失敗，請重試' })
    } finally {
      setSubmitting(false)
    }
  }

  // 計算總金額
  const calculateTotal = () => {
    const selectedPkg = packages.find(pkg => pkg.package_id.toString() === selectedPackage)
    return selectedPkg ? selectedPkg.price * quantity : 0
  }

  // 如果用戶未登入
  if (!authLoading && !user) {
    return (
      <div className="bg-[#2a2d4e] rounded-lg shadow-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-white mb-4">
          請先登入才能下訂單
        </h3>
        <p className="text-gray-300 mb-6">
          您需要先登入帳號才能進行儲值操作
        </p>
        <Link
          href="/auth"
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          前往登入
        </Link>
      </div>
    )
  }

  // 成功狀態
  if (success) {
    return (
      <div className="bg-[#2a2d4e] rounded-lg shadow-lg p-8 text-center">
        <div className="text-green-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-4">
          訂單建立成功！
        </h3>
        <p className="text-gray-300 mb-6">
          請等待處理，我們將盡快為您完成儲值。
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors mr-4"
        >
          繼續儲值
        </button>
        <Link
          href="/shop"
          className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          返回商店
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 動態遊戲選項 */}
      {gameConfig.fields.length > 0 && (
        <div className="bg-[#2a2d4e] rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6">
            角色資訊
          </h3>
          <DynamicGameOptions
            fields={gameConfig.fields}
            values={formData}
            onChange={handleFieldChange}
            errors={errors}
          />
        </div>
      )}

      {/* 套餐選擇 */}
      <div className="bg-[#2a2d4e] rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          選擇儲值套餐
        </h3>
        <div className="space-y-4">
          {packages.map((pkg) => (
            <label
              key={pkg.package_id}
              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPackage === pkg.package_id.toString()
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="package"
                  value={pkg.package_id}
                  checked={selectedPackage === pkg.package_id.toString()}
                  onChange={(e) => setSelectedPackage(e.target.value)}
                  className="text-purple-500 focus:ring-purple-500"
                />
                <div>
                  <p className="font-medium text-white">{pkg.name}</p>
                  {pkg.description && (
                    <p className="text-sm text-gray-400">{pkg.description}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">NT$ {pkg.price}</p>
              </div>
            </label>
          ))}
        </div>
        {errors.package && (
          <p className="text-red-400 text-sm mt-2">{errors.package}</p>
        )}
      </div>

      {/* 數量選擇 */}
      <div className="bg-[#2a2d4e] rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          數量
        </h3>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            -
          </button>
          <span className="text-xl font-semibold text-white min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* 付款方式 */}
      <div className="bg-[#2a2d4e] rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          付款方式
        </h3>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <label
              key={method.payment_method_id}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedPaymentMethod === method.payment_method_id.toString()
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <input
                type="radio"
                name="payment_method"
                value={method.payment_method_id}
                checked={selectedPaymentMethod === method.payment_method_id.toString()}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="text-purple-500 focus:ring-purple-500 mr-3"
              />
              <span className="text-white">{method.method}</span>
            </label>
          ))}
        </div>
        {errors.payment_method && (
          <p className="text-red-400 text-sm mt-2">{errors.payment_method}</p>
        )}
      </div>

      {/* 訂單摘要 */}
      <div className="bg-[#2a2d4e] rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          訂單摘要
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between text-gray-300">
            <span>遊戲</span>
            <span>{game.game_name}</span>
          </div>
          {selectedPackage && (
            <div className="flex justify-between text-gray-300">
              <span>套餐</span>
              <span>{packages.find(pkg => pkg.package_id.toString() === selectedPackage)?.name}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-300">
            <span>數量</span>
            <span>{quantity}</span>
          </div>
          <div className="border-t border-gray-600 pt-3">
            <div className="flex justify-between text-lg font-semibold text-white">
              <span>總金額</span>
              <span>NT$ {calculateTotal()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 提交按鈕 */}
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {submitting ? '處理中...' : '立即購買'}
        </button>
        <button
          type="button"
          className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
        >
          加入購物車
        </button>
      </div>

      {errors.submit && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
          {errors.submit}
        </div>
      )}
    </form>
  )
} 