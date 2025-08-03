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

  // 獲取遊戲標籤
  const { data: gameTags, error: gameTagsError } = await supabase
    .from('game_tags')
    .select(`
      tag_id,
      tags (
        id,
        name,
        display_name
      )
    `)
    .eq('game_id', resolvedParams.id)

  if (gameTagsError) {
    console.error('Error fetching game tags:', gameTagsError)
  }

  // 獲取所有可用標籤
  const { data: allTags, error: allTagsError } = await supabase
    .from('tags')
    .select('*')
    .order('id')

  if (allTagsError) {
    console.error('Error fetching all tags:', allTagsError)
  }

  // 將選項和標籤加入遊戲物件
  const gameWithOptions = {
    ...game,
    options: options || [],
    tags: gameTags?.map(gt => gt.tags) || [],
    availableTags: allTags || []
  }

  return (
    <div>
      <GameForm game={gameWithOptions} />
    </div>
  )
}
