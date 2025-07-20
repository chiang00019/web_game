// 遊戲配置欄位類型
export type FieldType = 'text' | 'select' | 'radio' | 'checkbox' | 'number'

// 單一遊戲配置項目
export interface GameConfigField {
  id: string
  game_id: number
  field_type: FieldType
  field_key: string
  field_label: string
  field_options?: string[] // 用於 select, radio, checkbox 類型
  placeholder?: string
  display_order: number
  is_required: boolean
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
  }
}

// 遊戲配置集合
export interface GameConfig {
  game_id: number
  fields: GameConfigField[]
}

// 動態表單資料
export interface GameFormData {
  [key: string]: string | string[] | number
}

// 遊戲資訊
export interface Game {
  game_id: number
  game_name: string
  category?: string
  icon?: string
  is_active: boolean
  description?: string
}

// 遊戲套餐
export interface GamePackage {
  package_id: number
  game_id: number
  name: string
  description?: string
  price: number
  is_active: boolean
}

// 付款方式
export interface PaymentMethod {
  payment_method_id: number
  method: string
}

// 訂單資料
export interface OrderFormData {
  package_id: string
  payment_method_id: string
  game_data: GameFormData
  quantity: number
} 