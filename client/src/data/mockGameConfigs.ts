import { GameConfig, Game, GamePackage, PaymentMethod } from '@/types/gameConfig'

// Mock 遊戲配置資料
export const mockGameConfigs: Record<number, GameConfig> = {
  // 原神配置
  1: {
    game_id: 1,
    fields: [
      {
        id: 'genshin_uid',
        game_id: 1,
        field_type: 'text',
        field_key: 'game_uid',
        field_label: '遊戲 UID',
        placeholder: '請輸入您的遊戲 UID（9 位數字）',
        display_order: 1,
        is_required: true,
        validation: {
          minLength: 9,
          maxLength: 9,
          pattern: '^[0-9]{9}$'
        }
      },
      {
        id: 'genshin_server',
        game_id: 1,
        field_type: 'select',
        field_key: 'game_server',
        field_label: '伺服器',
        field_options: ['亞洲伺服器', '美洲伺服器', '歐洲伺服器', 'TW,HK,MO伺服器'],
        display_order: 2,
        is_required: true
      },
      {
        id: 'genshin_username',
        game_id: 1,
        field_type: 'text',
        field_key: 'game_username',
        field_label: '角色暱稱',
        placeholder: '請輸入您的角色暱稱',
        display_order: 3,
        is_required: true,
        validation: {
          minLength: 1,
          maxLength: 20
        }
      },
      {
        id: 'genshin_level',
        game_id: 1,
        field_type: 'number',
        field_key: 'character_level',
        field_label: '冒險等級',
        placeholder: '請輸入您的冒險等級',
        display_order: 4,
        is_required: false,
        validation: {
          min: 1,
          max: 60
        }
      }
    ]
  },

  // 崩壞：星穹鐵道配置
  2: {
    game_id: 2,
    fields: [
      {
        id: 'hsr_uid',
        game_id: 2,
        field_type: 'text',
        field_key: 'game_uid',
        field_label: '開拓者 UID',
        placeholder: '請輸入您的開拓者 UID（9 位數字）',
        display_order: 1,
        is_required: true,
        validation: {
          minLength: 9,
          maxLength: 9,
          pattern: '^[0-9]{9}$'
        }
      },
      {
        id: 'hsr_server',
        game_id: 2,
        field_type: 'select',
        field_key: 'game_server',
        field_label: '伺服器',
        field_options: ['亞洲伺服器', '美洲伺服器', '歐洲伺服器'],
        display_order: 2,
        is_required: true
      },
      {
        id: 'hsr_username',
        game_id: 2,
        field_type: 'text',
        field_key: 'game_username',
        field_label: '開拓者暱稱',
        placeholder: '請輸入您的開拓者暱稱',
        display_order: 3,
        is_required: true,
        validation: {
          minLength: 1,
          maxLength: 20
        }
      },
      {
        id: 'hsr_level',
        game_id: 2,
        field_type: 'number',
        field_key: 'trailblazer_level',
        field_label: '開拓等級',
        placeholder: '請輸入您的開拓等級',
        display_order: 4,
        is_required: false,
        validation: {
          min: 1,
          max: 70
        }
      }
    ]
  },

  // 預設配置（適用於其他遊戲）
  default: {
    game_id: 0,
    fields: [
      {
        id: 'default_uid',
        game_id: 0,
        field_type: 'text',
        field_key: 'game_uid',
        field_label: '遊戲角色 ID',
        placeholder: '請輸入您的遊戲角色 ID',
        display_order: 1,
        is_required: true,
        validation: {
          minLength: 3,
          maxLength: 50
        }
      },
      {
        id: 'default_server',
        game_id: 0,
        field_type: 'text',
        field_key: 'game_server',
        field_label: '伺服器',
        placeholder: '請輸入您的伺服器名稱',
        display_order: 2,
        is_required: true,
        validation: {
          minLength: 1,
          maxLength: 30
        }
      },
      {
        id: 'default_username',
        game_id: 0,
        field_type: 'text',
        field_key: 'game_username',
        field_label: '角色暱稱',
        placeholder: '請輸入您的角色暱稱',
        display_order: 3,
        is_required: true,
        validation: {
          minLength: 1,
          maxLength: 20
        }
      }
    ]
  }
}

// Mock 遊戲資料
export const mockGames: Record<number, Game> = {
  1: {
    game_id: 1,
    game_name: '原神',
    category: 'RPG',
    icon: 'https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=原神',
    is_active: true,
    description: '在璃月和蒙德的世界中展開冒險，與各種元素力量戰鬥，體驗開放世界的魅力。'
  },
  2: {
    game_id: 2,
    game_name: '崩壞：星穹鐵道',
    category: 'RPG',
    icon: 'https://via.placeholder.com/200x200/7C3AED/FFFFFF?text=星鐵',
    is_active: true,
    description: '搭乘星穹列車，在銀河中展開冒險旅程，體驗回合制戰鬥的策略樂趣。'
  }
}

// Mock 套餐資料
export const mockPackages: Record<number, GamePackage[]> = {
  1: [
    { package_id: 1, game_id: 1, name: '小額儲值', description: '適合新手玩家', price: 100, is_active: true },
    { package_id: 2, game_id: 1, name: '標準儲值', description: '推薦選擇', price: 500, is_active: true },
    { package_id: 3, game_id: 1, name: '大額儲值', description: '最划算選擇', price: 1000, is_active: true }
  ],
  2: [
    { package_id: 4, game_id: 2, name: 'Express Supply', description: 'Honkai Star Rail package', price: 300, is_active: true },
    { package_id: 5, game_id: 2, name: 'Nameless Honor', description: 'Premium package', price: 600, is_active: true }
  ]
}

// Mock 付款方式資料
export const mockPaymentMethods: PaymentMethod[] = [
  { payment_method_id: 1, method: '銀行轉帳' },
  { payment_method_id: 2, method: '超商代碼' },
  { payment_method_id: 3, method: '線上支付' }
]

// 輔助函式：取得遊戲配置
export function getGameConfig(gameId: number): GameConfig {
  return mockGameConfigs[gameId] || mockGameConfigs.default
}

// 輔助函式：取得遊戲資訊
export function getGameInfo(gameId: number): Game | null {
  return mockGames[gameId] || null
}

// 輔助函式：取得遊戲套餐
export function getGamePackages(gameId: number): GamePackage[] {
  return mockPackages[gameId] || []
}

// 輔助函式：取得付款方式
export function getPaymentMethods(): PaymentMethod[] {
  return mockPaymentMethods
} 