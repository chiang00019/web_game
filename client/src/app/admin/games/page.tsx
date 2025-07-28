import { createSupabaseServer } from '@/utils/supabase/server'

import GameList from '@/components/admin/games/GameList'

export default async function GamesPage() {
  const supabase = await createSupabaseServer()
  const { data: games, error } = await supabase.from('games').select('*')

  if (error) {
    console.error('Error fetching games:', error)
    return <div>Error fetching games</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Games</h1>
      <GameList games={games} />
    </div>
  )
}