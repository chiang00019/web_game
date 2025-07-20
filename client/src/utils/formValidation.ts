import { GameConfigField, GameFormData } from '@/types/gameConfig'

export interface ValidationError {
  field: string
  message: string
  type: 'required' | 'format' | 'length' | 'range' | 'custom'
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  fieldErrors: Record<string, string>
}

// 驗證單一欄位
export function validateField(
  field: GameConfigField, 
  value: any, 
  customMessages?: Record<string, string>
): ValidationError | null {
  const fieldName = field.field_label
  
  // 必填驗證
  if (field.is_required) {
    if (value === undefined || value === null || value === '') {
      return {
        field: field.field_key,
        message: customMessages?.required || `${fieldName}為必填項目`,
        type: 'required'
      }
    }
    
    // 陣列類型的必填驗證
    if (Array.isArray(value) && value.length === 0) {
      return {
        field: field.field_key,
        message: customMessages?.required || `${fieldName}至少需要選擇一個選項`,
        type: 'required'
      }
    }
  }

  // 如果值為空且非必填，跳過其他驗證
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null
  }

  const validation = field.validation
  if (!validation) return null

  // 文字長度驗證
  if (field.field_type === 'text') {
    const stringValue = String(value)
    
    if (validation.minLength !== undefined && stringValue.length < validation.minLength) {
      return {
        field: field.field_key,
        message: customMessages?.minLength || `${fieldName}至少需要 ${validation.minLength} 個字符`,
        type: 'length'
      }
    }
    
    if (validation.maxLength !== undefined && stringValue.length > validation.maxLength) {
      return {
        field: field.field_key,
        message: customMessages?.maxLength || `${fieldName}不能超過 ${validation.maxLength} 個字符`,
        type: 'length'
      }
    }

    // 正則表達式驗證
    if (validation.pattern) {
      try {
        const regex = new RegExp(validation.pattern)
        if (!regex.test(stringValue)) {
          return {
            field: field.field_key,
            message: customMessages?.pattern || `${fieldName}格式不正確`,
            type: 'format'
          }
        }
      } catch (error) {
        console.error('正則表達式錯誤:', validation.pattern, error)
        return {
          field: field.field_key,
          message: `${fieldName}驗證規則設定錯誤`,
          type: 'custom'
        }
      }
    }
  }

  // 數字範圍驗證
  if (field.field_type === 'number') {
    const numValue = Number(value)
    
    if (isNaN(numValue)) {
      return {
        field: field.field_key,
        message: customMessages?.number || `${fieldName}必須是有效的數字`,
        type: 'format'
      }
    }
    
    if (validation.min !== undefined && numValue < validation.min) {
      return {
        field: field.field_key,
        message: customMessages?.min || `${fieldName}不能小於 ${validation.min}`,
        type: 'range'
      }
    }
    
    if (validation.max !== undefined && numValue > validation.max) {
      return {
        field: field.field_key,
        message: customMessages?.max || `${fieldName}不能大於 ${validation.max}`,
        type: 'range'
      }
    }
  }

  return null
}

// 驗證整個表單
export function validateForm(
  fields: GameConfigField[],
  formData: GameFormData,
  customMessages?: Record<string, Record<string, string>>
): ValidationResult {
  const errors: ValidationError[] = []

  for (const field of fields) {
    const value = formData[field.field_key]
    const fieldCustomMessages = customMessages?.[field.field_key]
    
    const error = validateField(field, value, fieldCustomMessages)
    if (error) {
      errors.push(error)
    }
  }

  // 轉換為 fieldErrors 格式
  const fieldErrors: Record<string, string> = {}
  errors.forEach(error => {
    fieldErrors[error.field] = error.message
  })

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors
  }
}

// 即時驗證（用於用戶輸入時）
export function validateFieldRealtime(
  field: GameConfigField,
  value: any,
  customMessages?: Record<string, string>
): string | null {
  // 即時驗證時，跳過必填檢查（除非用戶已經離開欄位）
  const tempField = { ...field, is_required: false }
  const error = validateField(tempField, value, customMessages)
  return error?.message || null
}

// 特殊驗證規則
export const specialValidators = {
  // 電子郵件驗證
  email: (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? null : '請輸入有效的電子郵件地址'
  },

  // 手機號碼驗證（台灣）
  taiwanPhone: (value: string): string | null => {
    const phoneRegex = /^(\+886|0)?9\d{8}$/
    return phoneRegex.test(value.replace(/\s/g, '')) ? null : '請輸入有效的台灣手機號碼'
  },

  // 身分證字號驗證（台灣）
  taiwanId: (value: string): string | null => {
    const idRegex = /^[A-Z][12]\d{8}$/
    if (!idRegex.test(value)) {
      return '請輸入有效的身分證字號格式'
    }

    // 身分證檢查碼驗證
    const letters = 'ABCDEFGHJKLMNPQRSTUVXYWZIO'
    const letterValue = letters.indexOf(value[0]) + 10
    const checkSum = Math.floor(letterValue / 10) + 
                    (letterValue % 10) * 9 +
                    parseInt(value[1]) * 8 +
                    parseInt(value[2]) * 7 +
                    parseInt(value[3]) * 6 +
                    parseInt(value[4]) * 5 +
                    parseInt(value[5]) * 4 +
                    parseInt(value[6]) * 3 +
                    parseInt(value[7]) * 2 +
                    parseInt(value[8]) * 1 +
                    parseInt(value[9])

    return (checkSum % 10 === 0) ? null : '身分證字號檢查碼錯誤'
  },

  // 密碼強度驗證
  strongPassword: (value: string): string | null => {
    if (value.length < 8) return '密碼至少需要 8 個字符'
    if (!/[A-Z]/.test(value)) return '密碼需要包含至少一個大寫字母'
    if (!/[a-z]/.test(value)) return '密碼需要包含至少一個小寫字母'
    if (!/\d/.test(value)) return '密碼需要包含至少一個數字'
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return '密碼需要包含至少一個特殊字符'
    return null
  },

  // URL 驗證
  url: (value: string): string | null => {
    try {
      new URL(value)
      return null
    } catch {
      return '請輸入有效的 URL'
    }
  }
}

// 條件式驗證（基於其他欄位的值）
export function validateConditional(
  field: GameConfigField,
  value: any,
  formData: GameFormData,
  conditions: {
    dependsOn: string
    when: (dependentValue: any) => boolean
    validator: (value: any) => string | null
  }[]
): string | null {
  for (const condition of conditions) {
    const dependentValue = formData[condition.dependsOn]
    if (condition.when(dependentValue)) {
      const error = condition.validator(value)
      if (error) return error
    }
  }
  return null
}

// 非同步驗證（例如檢查用戶名是否已存在）
export async function validateAsync(
  field: GameConfigField,
  value: any,
  validator: (value: any) => Promise<string | null>
): Promise<string | null> {
  try {
    return await validator(value)
  } catch (error) {
    console.error('非同步驗證錯誤:', error)
    return '驗證過程發生錯誤'
  }
}

// 表單提交前的最終驗證
export function validateForSubmission(
  fields: GameConfigField[],
  formData: GameFormData,
  additionalValidators?: {
    [fieldKey: string]: (value: any, formData: GameFormData) => string | null
  }
): ValidationResult {
  const basicResult = validateForm(fields, formData)
  
  if (additionalValidators) {
    for (const [fieldKey, validator] of Object.entries(additionalValidators)) {
      const value = formData[fieldKey]
      const error = validator(value, formData)
      if (error) {
        basicResult.errors.push({
          field: fieldKey,
          message: error,
          type: 'custom'
        })
        basicResult.fieldErrors[fieldKey] = error
      }
    }
  }
  
  basicResult.isValid = basicResult.errors.length === 0
  return basicResult
} 