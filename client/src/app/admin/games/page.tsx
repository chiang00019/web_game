'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlusIcon, EditIcon, TrashIcon, SettingsIcon } from 'lucide-react'
import GameForm from '@/components/admin/GameForm'

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([])
  const [selectedGame, setSelectedGame] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    const response = await fetch('/api/games')
    const data = await response.json()
    setGames(data)
  }

  const handleSave = async (game: any) => {
    if (selectedGame) {
      // @ts-ignore
      const response = await fetch(`/api/games/${selectedGame.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game),
      })
    } else {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game),
      })
    }
    fetchGames()
    setIsFormOpen(false)
    setSelectedGame(null)
  }

  const handleEdit = (game: any) => {
    setSelectedGame(game)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/games/${id}`, {
      method: 'DELETE',
    })
    fetchGames()
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] p-6">
      <div className="max-w-7xl mx-auto">
        {/* 標題區域 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                遊戲管理
              </h1>
              <p className="text-gray-400 mt-2">
                管理網站上的所有遊戲項目
              </p>
            </div>
            
            <button
              onClick={() => {
                setSelectedGame(null)
                setIsFormOpen(true)
              }}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>新增遊戲</span>
            </button>
          </div>
        </div>

        {/* 表單區域 */}
        {isFormOpen && (
          <div className="mb-8 bg-[#2a2d4e] rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">
              {selectedGame ? '編輯遊戲' : '新增遊戲'}
            </h3>
            <GameForm game={selectedGame} onSave={handleSave} />
            <button
              onClick={() => {
                setIsFormOpen(false)
                setSelectedGame(null)
              }}
              className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              取消
            </button>
          </div>
        )}

        {/* 遊戲列表 */}
        <div className="bg-[#2a2d4e] rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-600">
            <h2 className="text-xl font-semibold text-white">
              遊戲列表 ({games.length})
            </h2>
          </div>
          
          {games.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">尚未新增任何遊戲</p>
              <button
                onClick={() => {
                  setSelectedGame(null)
                  setIsFormOpen(true)
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                新增第一個遊戲
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#1a1b2e]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      遊戲名稱
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      描述
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      價格
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      狀態
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600">
                  {games.map((game) => (
                    <tr key={game.id} className="hover:bg-[#1a1b2e] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">
                              {game.name?.charAt(0) || 'G'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{game.name}</p>
                            <p className="text-gray-400 text-sm">{game.category || '遊戲'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-300 max-w-xs truncate" title={game.description}>
                          {game.description || '無描述'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">
                          {game.price ? `NT$ ${game.price}` : '未設定'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          game.is_active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {game.is_active ? '啟用' : '停用'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/games/${game.id}/config`}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                            title="配置管理"
                          >
                            <SettingsIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleEdit(game)}
                            className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
                            title="編輯"
                          >
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(game.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            title="刪除"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
