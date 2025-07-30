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
      <div className="text-center py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <GamepadIcon className="h-6 w-6 text-gray-400" />
            </div>
            <CardTitle className="text-gray-900">還沒有遊戲</CardTitle>
            <CardDescription>
              開始創建您的第一個遊戲來管理遊戲內容
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/games/new">
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                創建遊戲
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GamepadIcon className="h-5 w-5 text-gray-600" />
          <span className="text-sm text-gray-600">共 {games.length} 個遊戲</span>
        </div>
        <Link href="/admin/games/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新增遊戲
          </Button>
        </Link>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Card key={game.id} className="group hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    {game.icon_path ? (
                      <Image
                        src={game.icon_path}
                        alt={game.name}
                        width={48}
                        height={48}
                        className="rounded-lg"
                      />
                    ) : (
                      <GamepadIcon className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{game.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={game.is_active ? "default" : "secondary"}>
                        {game.is_active ? "啟用" : "停用"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              {game.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {game.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>建立於 {formatDate(game.created_at)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/games/${game.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="h-3 w-3 mr-1" />
                    編輯
                  </Button>
                </Link>
                
                <Link href={`/admin/games/${game.id}/config`}>
                  <Button variant="outline" size="sm">
                    <Settings className="h-3 w-3" />
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(game.id, game.name)}
                  disabled={deletingId === game.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
