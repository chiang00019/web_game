import { createSupabaseServer } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import GameDetails from '@/components/shop/games/GameDetails'

export default async function GameDetailsPage({ params }) {
  const supabase = await createSupabaseServer()
  const { data: game, error } = await supabase
    .from('games')
    .select('*, game_options(*), tags(*)')
    .eq('id', params.id)
    .single()

  if (error) {
    console.error('Error fetching game:', error)
    return <div>Error fetching game</div>
  }

  return <GameDetails game={game} />
}
