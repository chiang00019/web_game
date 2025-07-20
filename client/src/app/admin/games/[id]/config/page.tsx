'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeftIcon, PlusIcon, EyeIcon, EditIcon, TrashIcon } from 'lucide-react'
import { 
  GameConfig, 
  GameConfigField, 
  Game
} from '@/types/gameConfig'
import { 
  getGameConfig, 
  getGameInfo 
} from '@/data/mockGameConfigs'
import GameConfigForm from '@/components/admin/GameConfigForm'
import TemplatePreview from '@/components/admin/TemplatePreview'

export default function GameConfigPage() {
  const params = useParams()
  const gameId = parseInt(params.id as string)

  // 狀態管理
  const [game, setGame] = useState<Game | null>(null)
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // UI 狀態
  const [showConfigForm, setShowConfigForm] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editingField, setEditingField] = useState<GameConfigField | null>(null)

  // 載入遊戲和配置資料
  useEffect(() => {
    const loadGameData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 使用 mock 資料 (在實際開發中會是 API 呼叫)
        const gameInfo = getGameInfo(gameId)
        if (!gameInfo) {
          setError('遊戲不存在')
          return
        }

        setGame(gameInfo)
        setGameConfig(getGameConfig(gameId))

      } catch (error) {
        console.error('載入遊戲資料失敗:', error)
        setError('載入遊戲資料失敗')
      } finally {
        setLoading(false)
      }
    }

    if (gameId) {
      loadGameData()
    }
  }, [gameId])

  // 新增配置欄位
  const handleAddField = (newField: Omit<GameConfigField, 'id'>) => {
    if (!gameConfig) return

    const fieldWithId: GameConfigField = {
      ...newField,
      id: `field_${Date.now()}`, // 簡單的 ID 生成
      game_id: gameId
    }

    const updatedConfig = {
      ...gameConfig,
      fields: [...gameConfig.fields, fieldWithId].sort((a, b) => a.display_order - b.display_order)
    }

    setGameConfig(updatedConfig)
    setShowConfigForm(false)
    
    // 在實際開發中，這裡會呼叫 API
    console.log('新增配置欄位:', fieldWithId)
  }

  // 更新配置欄位
  const handleUpdateField = (updatedField: GameConfigField) => {
    if (!gameConfig) return

    const updatedConfig = {
      ...gameConfig,
      fields: gameConfig.fields
        .map(field => field.id === updatedField.id ? updatedField : field)
        .sort((a, b) => a.display_order - b.display_order)
    }

    setGameConfig(updatedConfig)
    setEditingField(null)
    setShowConfigForm(false)
    
    // 在實際開發中，這裡會呼叫 API
    console.log('更新配置欄位:', updatedField)
  }

  // 刪除配置欄位
  const handleDeleteField = (fieldId: string) => {
    if (!gameConfig) return
    
    if (confirm('確定要刪除這個配置欄位嗎？')) {
      const updatedConfig = {
        ...gameConfig,
        fields: gameConfig.fields.filter(field => field.id !== fieldId)
      }

      setGameConfig(updatedConfig)
      
      // 在實際開發中，這裡會呼叫 API
      console.log('刪除配置欄位:', fieldId)
    }
  }

  // 編輯欄位
  const handleEditField = (field: GameConfigField) => {
    setEditingField(field)
    setShowConfigForm(true)
  }

  // 取消表單
  const handleCancelForm = () => {
    setShowConfigForm(false)
    setEditingField(null)
  }

  // 欄位類型顯示名稱
  const getFieldTypeDisplay = (type: string) => {
    const typeMap: Record<string, string> = {
      text: '文字輸入',
      number: '數字輸入',
      select: '下拉選單',
      radio: '單選按鈕',
      checkbox: '複選框'
    }
    return typeMap[type] || type
  }

  // 載入狀態
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f23] p-6">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  // 錯誤狀態
  if (error || !game || !gameConfig) {
    return (
      <div className="min-h-screen bg-[#0f0f23] p-6">
        <div className="text-center py-20">
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-6 py-4 rounded-lg inline-block">
            {error || '遊戲不存在'}
          </div>
          <div className="mt-6">
            <Link
              href="/admin/games"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              返回遊戲管理
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] p-6">
      <div className="max-w-7xl mx-auto">
        {/* 標題區域 */}
        <div className="mb-8">
          <Link
            href="/admin/games"
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            返回遊戲管理
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                {game.game_name} 配置管理
              </h1>
              <p className="text-gray-400 mt-2">
                管理遊戲的動態表單欄位配置
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <EyeIcon className="w-4 h-4" />
                <span>{showPreview ? '隱藏預覽' : '預覽模板'}</span>
              </button>
              
              <button
                onClick={() => setShowConfigForm(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                <span>新增欄位</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 配置列表 */}
          <div className="space-y-6">
            <div className="bg-[#2a2d4e] rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                目前配置欄位 ({gameConfig.fields.length})
              </h2>
              
              {gameConfig.fields.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">尚未設定任何欄位</p>
                  <button
                    onClick={() => setShowConfigForm(true)}
                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    新增第一個欄位
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {gameConfig.fields
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((field) => (
                      <div
                        key={field.id}
                        className="bg-[#1a1b2e] border border-gray-600 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-sm">
                                {field.display_order}
                              </span>
                              <h3 className="font-medium text-white">
                                {field.field_label}
                              </h3>
                              {field.is_required && (
                                <span className="text-red-400 text-sm">*</span>
                              )}
                            </div>
                            
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                              <span>類型: {getFieldTypeDisplay(field.field_type)}</span>
                              <span>欄位名稱: {field.field_key}</span>
                            </div>
                            
                            {field.field_options && field.field_options.length > 0 && (
                              <div className="mt-2 text-sm text-gray-400">
                                選項: {field.field_options.join(', ')}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditField(field)}
                              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                              title="編輯"
                            >
                              <EditIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteField(field.id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              title="刪除"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* 表單/預覽區域 */}
          <div className="space-y-6">
            {showConfigForm && (
              <GameConfigForm
                field={editingField}
                onSave={editingField ? handleUpdateField : handleAddField}
                onCancel={handleCancelForm}
              />
            )}
            
            {showPreview && (
              <TemplatePreview
                game={game}
                gameConfig={gameConfig}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 