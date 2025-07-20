'use client'

import { useState } from 'react'
import { Game, GameConfig, GameFormData } from '@/types/gameConfig'
import DynamicGameOptions from '@/components/shop/DynamicGameOptions'
import { getGamePackages, getPaymentMethods } from '@/data/mockGameConfigs'

interface TemplatePreviewProps {
  game: Game
  gameConfig: GameConfig
}

export default function TemplatePreview({ game, gameConfig }: TemplatePreviewProps) {
  // 模擬表單資料
  const [previewData, setPreviewData] = useState<GameFormData>({})
  
  // 模擬套餐和付款方式
  const packages = getGamePackages(game.game_id)
  const paymentMethods = getPaymentMethods()
  
  // 模擬選擇的套餐和付款方式
  const [selectedPackage, setSelectedPackage] = useState(packages[0]?.package_id.toString() || '')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethods[0]?.payment_method_id.toString() || '')
  const [quantity, setQuantity] = useState(1)

  // 處理欄位變更
  const handleFieldChange = (key: string, value: string | string[] | number) => {
    setPreviewData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // 計算總金額
  const calculateTotal = () => {
    const selectedPkg = packages.find(pkg => pkg.package_id.toString() === selectedPackage)
    return selectedPkg ? selectedPkg.price * quantity : 0
  }

  return (
    <div className="bg-[#2a2d4e] rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          模板預覽
        </h3>
        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
          即時預覽
        </span>
      </div>

      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* 遊戲資訊預覽 */}
        <div className="bg-[#1a1b2e] rounded-lg p-4 border border-gray-600">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {game.game_name.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white">{game.game_name}</h4>
              <p className="text-gray-400 text-sm">{game.category || '遊戲'}</p>
            </div>
          </div>
        </div>

        {/* 動態表單欄位預覽 */}
        {gameConfig.fields.length > 0 ? (
          <div className="bg-[#1a1b2e] rounded-lg p-4 border border-gray-600">
            <h4 className="text-lg font-semibold text-white mb-4">
              角色資訊
            </h4>
            <DynamicGameOptions
              fields={gameConfig.fields}
              values={previewData}
              onChange={handleFieldChange}
              errors={{}}
            />
          </div>
        ) : (
          <div className="bg-[#1a1b2e] rounded-lg p-4 border border-gray-600 text-center">
            <p className="text-gray-400">
              尚未設定任何動態欄位
            </p>
            <p className="text-gray-500 text-sm mt-1">
              請先新增欄位來查看預覽效果
            </p>
          </div>
        )}

        {/* 套餐選擇預覽 */}
        {packages.length > 0 && (
          <div className="bg-[#1a1b2e] rounded-lg p-4 border border-gray-600">
            <h4 className="text-lg font-semibold text-white mb-4">
              選擇儲值套餐
            </h4>
            <div className="space-y-3">
              {packages.map((pkg) => (
                <label
                  key={pkg.package_id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPackage === pkg.package_id.toString()
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="preview_package"
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
          </div>
        )}

        {/* 數量選擇預覽 */}
        <div className="bg-[#1a1b2e] rounded-lg p-4 border border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-4">
            數量
          </h4>
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

        {/* 付款方式預覽 */}
        {paymentMethods.length > 0 && (
          <div className="bg-[#1a1b2e] rounded-lg p-4 border border-gray-600">
            <h4 className="text-lg font-semibold text-white mb-4">
              付款方式
            </h4>
            <div className="space-y-2">
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
                    name="preview_payment_method"
                    value={method.payment_method_id}
                    checked={selectedPaymentMethod === method.payment_method_id.toString()}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="text-purple-500 focus:ring-purple-500 mr-3"
                  />
                  <span className="text-white">{method.method}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 訂單摘要預覽 */}
        <div className="bg-[#1a1b2e] rounded-lg p-4 border border-gray-600">
          <h4 className="text-lg font-semibold text-white mb-4">
            訂單摘要
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>遊戲</span>
              <span>{game.game_name}</span>
            </div>
            {selectedPackage && packages.length > 0 && (
              <div className="flex justify-between text-gray-300">
                <span>套餐</span>
                <span>{packages.find(pkg => pkg.package_id.toString() === selectedPackage)?.name}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-300">
              <span>數量</span>
              <span>{quantity}</span>
            </div>
            
            {/* 動態欄位摘要 */}
            {gameConfig.fields.length > 0 && (
              <>
                <div className="border-t border-gray-600 pt-3">
                  <p className="text-gray-400 text-sm mb-2">填寫資訊:</p>
                  {gameConfig.fields
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((field) => {
                      const value = previewData[field.field_key]
                      return (
                        <div key={field.id} className="flex justify-between text-gray-300 text-sm">
                          <span>{field.field_label}:</span>
                          <span className="text-gray-400">
                            {value 
                              ? Array.isArray(value) 
                                ? value.join(', ') 
                                : String(value)
                              : '(未填寫)'
                            }
                          </span>
                        </div>
                      )
                    })
                  }
                </div>
              </>
            )}
            
            <div className="border-t border-gray-600 pt-3">
              <div className="flex justify-between text-lg font-semibold text-white">
                <span>總金額</span>
                <span>NT$ {calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 按鈕預覽 */}
        <div className="bg-[#1a1b2e] rounded-lg p-4 border border-gray-600">
          <div className="flex space-x-4">
            <button
              disabled
              className="flex-1 bg-purple-600/50 text-white py-3 px-6 rounded-lg cursor-not-allowed font-semibold"
            >
              立即購買 (預覽模式)
            </button>
            <button
              disabled
              className="flex-1 bg-gray-600/50 text-white py-3 px-6 rounded-lg cursor-not-allowed font-semibold"
            >
              加入購物車 (預覽模式)
            </button>
          </div>
        </div>

        {/* 預覽說明 */}
        <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-400 text-sm">ℹ️</span>
            <div className="text-yellow-300 text-sm">
              <p className="font-medium mb-1">預覽說明:</p>
              <ul className="space-y-1 text-xs">
                <li>• 這是即時預覽，會根據您的配置自動更新</li>
                <li>• 預覽中的按鈕和互動功能已停用</li>
                <li>• 實際頁面的樣式可能會有細微差異</li>
                <li>• 可以在左側填寫欄位來測試表單驗證</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 