'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDraftSave } from '@/hooks/useDraftSave'
import Link from 'next/link'
import { ClockIcon, SaveIcon, RotateCcwIcon, XIcon } from 'lucide-react'
import DynamicGameOptions from './DynamicGameOptions'
import { validateForSubmission, validateFieldRealtime } from '@/utils/formValidation'
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
  
  // 草稿儲存
  const draftKey = `game_${game.game_id}_order`
  const {
    data: draftData,
    updateData: updateDraft,
    hasDraft,
    draftInfo,
    isAutoSaving,
    restoreDraft,
    clearDraft
  } = useDraftSave({
    formData: {} as GameFormData,
    selectedPackage: '',
    selectedPaymentMethod: '',
    quantity: 1
  }, {
    key: draftKey,
    onRestore: (data) => {
      console.log('恢復草稿:', data)
    }
  })
  
  // 表單狀態 - 使用草稿資料或預設值
  const [formData, setFormData] = useState<GameFormData>(draftData.formData || {})
  const [selectedPackage, setSelectedPackage] = useState<string>(draftData.selectedPackage || '')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(draftData.selectedPaymentMethod || '')
  const [quantity, setQuantity] = useState<number>(draftData.quantity || 1)
  
  // UI 狀態
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showDraftPrompt, setShowDraftPrompt] = useState(false)

  // 初始化預設值和草稿檢查
  useEffect(() => {
    // 檢查是否有草稿且詢問用戶是否恢復
    if (hasDraft && !showDraftPrompt) {
      setShowDraftPrompt(true)
    }
    
    // 設定預設值 (如果沒有草稿資料)
    if (packages.length > 0 && !selectedPackage) {
      const defaultPackage = packages[0].package_id.toString()
      setSelectedPackage(defaultPackage)
      updateDraft({ selectedPackage: defaultPackage })
    }
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      const defaultPayment = paymentMethods[0].payment_method_id.toString()
      setSelectedPaymentMethod(defaultPayment)
      updateDraft({ selectedPaymentMethod: defaultPayment })
    }
  }, [packages, paymentMethods, selectedPackage, selectedPaymentMethod, hasDraft, showDraftPrompt, updateDraft])

  // 同步狀態到草稿
  useEffect(() => {
    updateDraft({
      formData,
      selectedPackage,
      selectedPaymentMethod,
      quantity
    })
  }, [formData, selectedPackage, selectedPaymentMethod, quantity, updateDraft])

  // 處理動態欄位變更
  const handleFieldChange = (key: string, value: string | string[] | number) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
    
    // 即時驗證
    validateFieldOnChange(key, value)
  }

  // 恢復草稿
  const handleRestoreDraft = () => {
    const restored = restoreDraft()
    if (restored) {
      setFormData(draftData.formData || {})
      setSelectedPackage(draftData.selectedPackage || '')
      setSelectedPaymentMethod(draftData.selectedPaymentMethod || '')
      setQuantity(draftData.quantity || 1)
    }
    setShowDraftPrompt(false)
  }

  // 忽略草稿
  const handleIgnoreDraft = () => {
    clearDraft()
    setShowDraftPrompt(false)
  }

  // 手動儲存草稿
  const handleSaveDraft = () => {
    updateDraft({
      formData,
      selectedPackage,
      selectedPaymentMethod,
      quantity
    })
  }

  // 驗證表單
  const validateForm = (): boolean => {
    // 使用增強的表單驗證
    const result = validateForSubmission(
      gameConfig.fields, 
      formData,
      {
        // 自訂驗證規則
        package: () => !selectedPackage ? '請選擇儲值套餐' : null,
        payment_method: () => !selectedPaymentMethod ? '請選擇付款方式' : null,
        quantity: () => quantity < 1 ? '數量必須大於 0' : null
      }
    )

    setErrors(result.fieldErrors)
    return result.isValid
  }

  // 即時驗證單一欄位
  const validateFieldOnChange = (fieldKey: string, value: string | string[] | number) => {
    const field = gameConfig.fields.find(f => f.field_key === fieldKey)
    if (field) {
      const error = validateFieldRealtime(field, value)
      if (error) {
        setErrors(prev => ({ ...prev, [fieldKey]: error }))
      } else {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[fieldKey]
          return newErrors
        })
      }
    }
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
      
      // 清空表單和草稿
      setFormData({})
      setSelectedPackage(packages[0]?.package_id.toString() || '')
      setSelectedPaymentMethod(paymentMethods[0]?.payment_method_id.toString() || '')
      setQuantity(1)
      clearDraft()
      
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
    <div className="space-y-6">
      {/* 草稿恢復提示 */}
      {showDraftPrompt && (
        <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ClockIcon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-blue-300 font-medium mb-2">發現未完成的訂單草稿</h4>
              <p className="text-blue-200 text-sm mb-3">
                我們發現您有一個未完成的訂單草稿，儲存於{' '}
                {draftInfo.lastSaved?.toLocaleString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                。是否要恢復之前填寫的資料？
              </p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleRestoreDraft}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <RotateCcwIcon className="w-4 h-4" />
                  <span>恢復草稿</span>
                </button>
                <button
                  type="button"
                  onClick={handleIgnoreDraft}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <XIcon className="w-4 h-4" />
                  <span>忽略草稿</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 自動儲存狀態 */}
      {(isAutoSaving || draftInfo.lastSaved) && (
        <div className="flex items-center justify-between bg-[#1a1b2e] border border-gray-600 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-2 text-sm">
            {isAutoSaving ? (
              <>
                <SaveIcon className="w-4 h-4 text-yellow-400 animate-pulse" />
                <span className="text-yellow-400">正在儲存草稿...</span>
              </>
            ) : draftInfo.lastSaved ? (
              <>
                <SaveIcon className="w-4 h-4 text-green-400" />
                <span className="text-green-400">
                  草稿已儲存於 {draftInfo.lastSaved.toLocaleTimeString('zh-TW')}
                </span>
              </>
            ) : null}
          </div>
          
          <button
            type="button"
            onClick={handleSaveDraft}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            手動儲存
          </button>
        </div>
      )}

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
    </div>
  )
} 