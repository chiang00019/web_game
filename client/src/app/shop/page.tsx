import { createSupabaseServer } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import GameCard from '@/components/shop/games/GameCard'

export default async function ShopPage() {
  const supabase = await createSupabaseServer()
  const { data: games, error } = await supabase.from('games').select('*')

  if (error) {
    console.error('Error fetching games:', error)
    return <div>Error fetching games</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}