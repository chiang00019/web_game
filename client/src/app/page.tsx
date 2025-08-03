import { createSupabaseServer } from '@/utils/supabase/server'
import GameCard from '@/components/shop/games/GameCard'
import BannerCarousel from '@/components/home/BannerCarousel'

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
    <div className="min-h-screen bg-gray-50">
      {/* 容器 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Carousel */}
        <BannerCarousel />
        
        {/* 熱門遊戲區塊 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">🔥 熱門遊戲</h2>
            <a 
              href="/shop" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              查看全部 →
            </a>
          </div>
          
          {games.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">目前沒有熱門遊戲</div>
              <p className="text-gray-400 mt-2">請稍後再來查看</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}