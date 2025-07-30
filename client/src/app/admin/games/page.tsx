import { createSupabaseServer } from '@/utils/supabase/server'
import GameList from '@/components/admin/games/GameList'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default async function GamesPage() {
  const supabase = await createSupabaseServer()
  const { data: games, error } = await supabase.from('games').select('*')

  if (error) {
    console.error('Error fetching games:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              錯誤
            </CardTitle>
            <CardDescription className="text-red-600">
              無法載入遊戲資料，請稍後再試。
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">遊戲管理</h1>
        <p className="text-gray-600">管理您的遊戲庫存和設定</p>
      </div>
      <GameList games={games || []} />
    </div>
  )
}