import { createSupabaseServer } from '@/utils/supabase/server'
import ModernGameCard from '@/components/shop/games/ModernGameCard'
import BannerCarousel from '@/components/home/BannerCarousel'

export default async function HomePage() {
  const supabase = await createSupabaseServer()
  
  // 獲取所有標籤
  const { data: tags, error: tagsError } = await supabase
    .from('tags')
    .select('*')
    .order('id')

  if (tagsError) {
    console.error('Error fetching tags:', tagsError)
    return <div>Error fetching tags</div>
  }

  // 為每個標籤獲取對應的遊戲
  const gamesByTag = await Promise.all(
    tags.map(async (tag) => {
      const { data: games, error } = await supabase
        .from('games')
        .select(`
          *,
          game_tags!inner(
            tags!inner(*)
          )
        `)
        .eq('game_tags.tags.id', tag.id)
        .eq('is_active', true)
        .limit(8)

      if (error) {
        console.error(`Error fetching games for tag ${tag.name}:`, error)
        return { tag, games: [] }
      }

      return { tag, games: games || [] }
    })
  )

  // 也獲取所有遊戲作為備用（如果沒有標籤的遊戲）
  const { data: allGames, error: allGamesError } = await supabase
    .from('games')
    .select('*')
    .eq('is_active', true)
    .limit(8)

  if (allGamesError) {
    console.error('Error fetching all games:', allGamesError)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 容器 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Carousel */}
        <BannerCarousel />
        
        {/* 按標籤顯示遊戲區塊 */}
        {gamesByTag.map((tagGroup, tagIndex) => {
          if (!tagGroup.games || tagGroup.games.length === 0) return null
          

          return (
            <section key={tagGroup.tag.id} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {tagGroup.tag.display_name}
                </h2>
                <a 
                  href="/shop" 
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  查看全部 →
                </a>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {tagGroup.games.map((game, index) => (
                  <div
                    key={game.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(tagIndex * 4 + index) * 100}ms` }}
                  >
                    <ModernGameCard game={game} />
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {/* 如果沒有任何標籤遊戲，顯示所有遊戲 */}
        {gamesByTag.every(tagGroup => !tagGroup.games || tagGroup.games.length === 0) && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">所有遊戲</h2>
              <a 
                href="/shop" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                查看全部 →
              </a>
            </div>
            
            {allGames && allGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ModernGameCard game={game} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative max-w-md mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl p-8">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">即將推出</h3>
                    <p className="text-gray-600 text-base">
                      我們正在準備更多精彩的遊戲，敬請期待！
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}