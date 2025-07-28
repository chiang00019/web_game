'use client'

import { useState, useEffect } from 'react'
import { XIcon, PlusIcon, MinusIcon } from 'lucide-react'
import { GameConfigField, FieldType } from '@/types/gameConfig'

interface GameConfigFormProps {
  field?: GameConfigField | null
  onSave: (field: Omit<GameConfigField, 'id'> | GameConfigField) => void
  onCancel: () => void
}

export default function GameConfigForm({ field, onSave, onCancel }: GameConfigFormProps) {
  const isEditing = !!field

  // 表單狀態
  const [formData, setFormData] = useState({
    field_type: 'text' as FieldType,
    field_key: '',
    field_label: '',
    field_options: [] as string[],
    placeholder: '',
    display_order: 1,
    is_required: false,
    validation: {
      min: undefined as number | undefined,
      max: undefined as number | undefined,
      minLength: undefined as number | undefined,
      maxLength: undefined as number | undefined,
      pattern: ''
    }
  })

  // 臨時選項輸入
  const [newOption, setNewOption] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 初始化表單資料
  useEffect(() => {
    if (field) {
      setFormData({
        field_type: field.field_type,
        field_key: field.field_key,
        field_label: field.field_label,
        field_options: field.field_options || [],
        placeholder: field.placeholder || '',
        display_order: field.display_order,
        is_required: field.is_required,
        validation: {
          min: field.validation?.min,
          max: field.validation?.max,
          minLength: field.validation?.minLength,
          maxLength: field.validation?.maxLength,
          pattern: field.validation?.pattern || ''
        }
      })
    }
  }, [field])

  // 處理表單欄位變更
  const handleInputChange = (key: string, value: string | number | boolean | FieldType | string[]) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }))
    
    // 清除錯誤
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[key]
        return newErrors
      })
    }
  }

  // 處理驗證規則變更
  const handleValidationChange = (key: string, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      validation: {
        ...prev.validation,
        [key]: value === '' ? undefined : value
      }
    }))
  }

  // 新增選項
  const handleAddOption = () => {
    if (newOption.trim()) {
      setFormData(prev => ({
        ...prev,
        field_options: [...prev.field_options, newOption.trim()]
      }))
      setNewOption('')
    }
  }

  // 移除選項
  const handleRemoveOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      field_options: prev.field_options.filter((_, i) => i !== index)
    }))
  }

  // 表單驗證
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.field_key.trim()) {
      newErrors.field_key = '欄位名稱為必填'
    } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.field_key)) {
      newErrors.field_key = '欄位名稱只能包含英文字母、數字和底線，且必須以字母或底線開頭'
    }

    if (!formData.field_label.trim()) {
      newErrors.field_label = '顯示標籤為必填'
    }

    if (formData.display_order < 1) {
      newErrors.display_order = '顯示順序必須大於 0'
    }

    // 選項類型驗證
    if (['select', 'radio', 'checkbox'].includes(formData.field_type)) {
      if (formData.field_options.length === 0) {
        newErrors.field_options = `${formData.field_type === 'select' ? '下拉選單' : formData.field_type === 'radio' ? '單選按鈕' : '複選框'}必須至少有一個選項`
      }
    }

    // 數字範圍驗證
    if (formData.validation.min !== undefined && formData.validation.max !== undefined) {
      if (formData.validation.min >= formData.validation.max) {
        newErrors.validation_range = '最小值必須小於最大值'
      }
    }

    // 字串長度驗證
    if (formData.validation.minLength !== undefined && formData.validation.maxLength !== undefined) {
      if (formData.validation.minLength >= formData.validation.maxLength) {
        newErrors.validation_length = '最小長度必須小於最大長度'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 提交表單
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // 清理驗證規則（移除空值）
    const cleanValidation = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(formData.validation).filter(([_, value]) => 
        value !== undefined && value !== ''
      )
    )

    const fieldData = {
      ...formData,
      validation: Object.keys(cleanValidation).length > 0 ? cleanValidation : undefined
    }

    if (isEditing && field) {
      onSave({
        ...field,
        ...fieldData
      })
    } else {
      onSave(fieldData)
    }
  }

  // 需要選項的欄位類型
  const needsOptions = ['select', 'radio', 'checkbox'].includes(formData.field_type)

  return (
    <div className="bg-[#2a2d4e] rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          {isEditing ? '編輯欄位' : '新增欄位'}
        </h3>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本設定 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              欄位類型 *
            </label>
            <select
              value={formData.field_type}
              onChange={(e) => handleInputChange('field_type', e.target.value as FieldType)}
              className="w-full px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="text">文字輸入</option>
              <option value="number">數字輸入</option>
              <option value="select">下拉選單</option>
              <option value="radio">單選按鈕</option>
              <option value="checkbox">複選框</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              顯示順序 *
            </label>
            <input
              type="number"
              min="1"
              value={formData.display_order}
              onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.display_order && (
              <p className="text-red-400 text-sm mt-1">{errors.display_order}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              欄位名稱 * <span className="text-xs text-gray-500">(程式使用)</span>
            </label>
            <input
              type="text"
              value={formData.field_key}
              onChange={(e) => handleInputChange('field_key', e.target.value)}
              placeholder="例如: game_uid, server_name"
              className={`w-full px-3 py-2 bg-[#1a1b2e] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.field_key ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.field_key && (
              <p className="text-red-400 text-sm mt-1">{errors.field_key}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              顯示標籤 *
            </label>
            <input
              type="text"
              value={formData.field_label}
              onChange={(e) => handleInputChange('field_label', e.target.value)}
              placeholder="例如: 遊戲 UID, 伺服器名稱"
              className={`w-full px-3 py-2 bg-[#1a1b2e] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.field_label ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.field_label && (
              <p className="text-red-400 text-sm mt-1">{errors.field_label}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            提示文字
          </label>
          <input
            type="text"
            value={formData.placeholder}
            onChange={(e) => handleInputChange('placeholder', e.target.value)}
            placeholder="輸入框的提示文字"
            className="w-full px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* 選項設定 */}
        {needsOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              選項設定 *
            </label>
            <div className="space-y-2">
              {formData.field_options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...formData.field_options]
                      newOptions[index] = e.target.value
                      handleInputChange('field_options', newOptions)
                    }}
                    className="flex-1 px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOption())}
                  placeholder="新增選項"
                  className="flex-1 px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            {errors.field_options && (
              <p className="text-red-400 text-sm mt-1">{errors.field_options}</p>
            )}
          </div>
        )}

        {/* 驗證規則 */}
        <div>
          <h4 className="text-lg font-medium text-white mb-4">驗證規則</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 數字範圍驗證 */}
            {formData.field_type === 'number' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    最小值
                  </label>
                  <input
                    type="number"
                    value={formData.validation.min || ''}
                    onChange={(e) => handleValidationChange('min', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    最大值
                  </label>
                  <input
                    type="number"
                    value={formData.validation.max || ''}
                    onChange={(e) => handleValidationChange('max', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </>
            )}

            {/* 文字長度驗證 */}
            {formData.field_type === 'text' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    最小長度
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.validation.minLength || ''}
                    onChange={(e) => handleValidationChange('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    最大長度
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.validation.maxLength || ''}
                    onChange={(e) => handleValidationChange('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* 正則表達式驗證 */}
          {formData.field_type === 'text' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                格式驗證 (正則表達式)
              </label>
              <input
                type="text"
                value={formData.validation.pattern || ''}
                onChange={(e) => handleValidationChange('pattern', e.target.value)}
                placeholder="例如: ^[0-9]{9}$ (9位數字)"
                className="w-full px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* 驗證錯誤 */}
          {(errors.validation_range || errors.validation_length) && (
            <div className="mt-2">
              {errors.validation_range && (
                <p className="text-red-400 text-sm">{errors.validation_range}</p>
              )}
              {errors.validation_length && (
                <p className="text-red-400 text-sm">{errors.validation_length}</p>
              )}
            </div>
          )}
        </div>

        {/* 必填設定 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="is_required"
            checked={formData.is_required}
            onChange={(e) => handleInputChange('is_required', e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-[#1a1b2e] border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
          />
          <label htmlFor="is_required" className="ml-2 text-sm text-gray-300">
            必填欄位
          </label>
        </div>

        {/* 按鈕 */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            {isEditing ? '更新欄位' : '新增欄位'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
} 