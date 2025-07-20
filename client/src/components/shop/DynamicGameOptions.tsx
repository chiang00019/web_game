'use client'

import { useState, useEffect } from 'react'
import { GameConfigField, GameFormData } from '@/types/gameConfig'

interface DynamicGameOptionsProps {
  fields: GameConfigField[]
  values: GameFormData
  onChange: (key: string, value: string | string[] | number) => void
  errors?: Record<string, string>
}

export default function DynamicGameOptions({ 
  fields, 
  values, 
  onChange, 
  errors = {} 
}: DynamicGameOptionsProps) {
  
  // 按照 display_order 排序欄位
  const sortedFields = [...fields].sort((a, b) => a.display_order - b.display_order)

  // 驗證單一欄位
  const validateField = (field: GameConfigField, value: any): string | null => {
    if (field.is_required && (!value || value === '')) {
      return `${field.field_label}為必填項目`
    }

    if (!field.validation || !value) return null

    const validation = field.validation

    // 文字長度驗證
    if (validation.minLength && String(value).length < validation.minLength) {
      return `${field.field_label}至少需要 ${validation.minLength} 個字符`
    }
    
    if (validation.maxLength && String(value).length > validation.maxLength) {
      return `${field.field_label}不能超過 ${validation.maxLength} 個字符`
    }

    // 數字範圍驗證
    if (field.field_type === 'number') {
      const numValue = Number(value)
      if (validation.min && numValue < validation.min) {
        return `${field.field_label}不能小於 ${validation.min}`
      }
      if (validation.max && numValue > validation.max) {
        return `${field.field_label}不能大於 ${validation.max}`
      }
    }

    // 正則表達式驗證
    if (validation.pattern && !new RegExp(validation.pattern).test(String(value))) {
      return `${field.field_label}格式不正確`
    }

    return null
  }

  // 渲染文字輸入欄位
  const renderTextInput = (field: GameConfigField) => (
    <div key={field.id} className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {field.field_label}
        {field.is_required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={values[field.field_key] as string || ''}
        onChange={(e) => onChange(field.field_key, e.target.value)}
        placeholder={field.placeholder}
        className={`w-full px-3 py-2 bg-[#1a1b2e] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
          errors[field.field_key] 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-gray-600 focus:border-purple-500'
        }`}
      />
      {errors[field.field_key] && (
        <p className="text-red-400 text-sm">{errors[field.field_key]}</p>
      )}
    </div>
  )

  // 渲染數字輸入欄位
  const renderNumberInput = (field: GameConfigField) => (
    <div key={field.id} className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {field.field_label}
        {field.is_required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type="number"
        value={values[field.field_key] as number || ''}
        onChange={(e) => onChange(field.field_key, e.target.value ? Number(e.target.value) : '')}
        placeholder={field.placeholder}
        min={field.validation?.min}
        max={field.validation?.max}
        className={`w-full px-3 py-2 bg-[#1a1b2e] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
          errors[field.field_key] 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-gray-600 focus:border-purple-500'
        }`}
      />
      {errors[field.field_key] && (
        <p className="text-red-400 text-sm">{errors[field.field_key]}</p>
      )}
    </div>
  )

  // 渲染下拉選單
  const renderSelect = (field: GameConfigField) => (
    <div key={field.id} className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {field.field_label}
        {field.is_required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <select
        value={values[field.field_key] as string || ''}
        onChange={(e) => onChange(field.field_key, e.target.value)}
        className={`w-full px-3 py-2 bg-[#1a1b2e] border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
          errors[field.field_key] 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-gray-600 focus:border-purple-500'
        }`}
      >
        <option value="">請選擇{field.field_label}</option>
        {field.field_options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[field.field_key] && (
        <p className="text-red-400 text-sm">{errors[field.field_key]}</p>
      )}
    </div>
  )

  // 渲染單選按鈕
  const renderRadio = (field: GameConfigField) => (
    <div key={field.id} className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {field.field_label}
        {field.is_required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="space-y-2">
        {field.field_options?.map((option) => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={field.field_key}
              value={option}
              checked={values[field.field_key] === option}
              onChange={(e) => onChange(field.field_key, e.target.value)}
              className="text-purple-500 focus:ring-purple-500 focus:ring-2"
            />
            <span className="text-gray-300">{option}</span>
          </label>
        ))}
      </div>
      {errors[field.field_key] && (
        <p className="text-red-400 text-sm">{errors[field.field_key]}</p>
      )}
    </div>
  )

  // 渲染複選框
  const renderCheckbox = (field: GameConfigField) => {
    const currentValues = values[field.field_key] as string[] || []
    
    const handleCheckboxChange = (option: string, checked: boolean) => {
      let newValues: string[]
      if (checked) {
        newValues = [...currentValues, option]
      } else {
        newValues = currentValues.filter(v => v !== option)
      }
      onChange(field.field_key, newValues)
    }

    return (
      <div key={field.id} className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {field.field_label}
          {field.is_required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <div className="space-y-2">
          {field.field_options?.map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentValues.includes(option)}
                onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                className="text-purple-500 focus:ring-purple-500 focus:ring-2"
              />
              <span className="text-gray-300">{option}</span>
            </label>
          ))}
        </div>
        {errors[field.field_key] && (
          <p className="text-red-400 text-sm">{errors[field.field_key]}</p>
        )}
      </div>
    )
  }

  // 渲染對應的欄位類型
  const renderField = (field: GameConfigField) => {
    switch (field.field_type) {
      case 'text':
        return renderTextInput(field)
      case 'number':
        return renderNumberInput(field)
      case 'select':
        return renderSelect(field)
      case 'radio':
        return renderRadio(field)
      case 'checkbox':
        return renderCheckbox(field)
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {sortedFields.map(renderField)}
    </div>
  )
} 