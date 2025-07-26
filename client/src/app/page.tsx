import { createSupabaseServer } from '@/utils/supabase/server'
import GameCard from '@/components/shop/games/GameCard'

export default async function HomePage() {
  const supabase = await createSupabaseServer()
  const { data: games, error } = await supabase
    .from('games')
    .select('*, game_tags!inner(tags!inner(name))')
    .eq('game_tags.tags.name', '熱門')

  if (error) {
    console.error('Error fetching popular games:', error)
    return <div>Error fetching popular games</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Popular Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}