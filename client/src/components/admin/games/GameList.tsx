'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, GamepadIcon, Calendar, Settings } from 'lucide-react'
import { useState } from 'react'

interface Game {
  id: number
  name: string
  description?: string
  icon_path?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface GameListProps {
  games: Game[]
}

export default function GameList({ games }: GameListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (gameId: number, gameName: string) => {
    if (!confirm(`確定要刪除遊戲「${gameName}」嗎？此操作無法復原。`)) {
      return
    }

    setDeletingId(gameId)
    try {
      const res = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        window.location.reload()
      } else {
        alert('刪除失敗，請稍後再試')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('刪除失敗，請稍後再試')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
          <Card className="relative bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="pb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <GamepadIcon className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-2">開始您的遊戲之旅</CardTitle>
              <CardDescription className="text-gray-600 text-base">
                創建您的第一個遊戲，開始管理精彩的遊戲內容
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Link href="/admin/games/new">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  <Plus className="h-5 w-5 mr-2" />
                  創建第一個遊戲
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats and Action Bar */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md">
                  <GamepadIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{games.length}</div>
                  <div className="text-sm text-gray-600">個遊戲</div>
                </div>
              </div>
              
              <div className="h-8 w-px bg-gray-300"></div>
              
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">{games.filter(g => g.is_active).length}</span> 啟用
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-500">{games.filter(g => !g.is_active).length}</span> 停用
                </div>
              </div>
            </div>
            
            <Link href="/admin/games/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                新增遊戲
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <div
            key={game.id}
            className="group animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card className="relative bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden">
              {/* Card Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <CardHeader className="relative pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        {game.icon_path ? (
                          <Image
                            src={game.icon_path}
                            alt={game.name}
                            width={56}
                            height={56}
                            className="rounded-xl"
                          />
                        ) : (
                          <GamepadIcon className="h-7 w-7 text-white" />
                        )}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                        {game.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge 
                          variant={game.is_active ? "default" : "secondary"}
                          className={`${
                            game.is_active 
                              ? "bg-green-100 text-green-700 border-green-200" 
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          } font-medium`}
                        >
                          {game.is_active ? "🟢 啟用" : "⚫ 停用"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative pt-0 space-y-4">
                {game.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>建立於 {formatDate(game.created_at)}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link href={`/admin/games/${game.id}/edit`} className="flex-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      編輯
                    </Button>
                  </Link>
                  
                  <Link href={`/admin/games/${game.id}/config`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(game.id, game.name)}
                    disabled={deletingId === game.id}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 disabled:opacity-50"
                  >
                    {deletingId === game.id ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
