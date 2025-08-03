import { createSupabaseServer } from '@/utils/supabase/server'
import GameForm from '@/components/admin/games/GameForm'

export default async function EditGamePage({ params }) {
  const resolvedParams = await params
  const supabase = await createSupabaseServer()
  
  // 獲取遊戲基本資料
  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error) {
    console.error('Error fetching game:', error)
    return <div>Error fetching game</div>
  }

  // 獲取遊戲選項
  const { data: options, error: optionsError } = await supabase
    .from('game_options')
    .select('*')
    .eq('game_id', resolvedParams.id)

  if (optionsError) {
    console.error('Error fetching game options:', optionsError)
  }

  // 將選項加入遊戲物件
  const gameWithOptions = {
    ...game,
    options: options || []
  }

  return (
    <div>
      <GameForm game={gameWithOptions} />
    </div>
  )
}
