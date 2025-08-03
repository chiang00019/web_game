import { createSupabaseServer } from '@/utils/supabase/server'
import ModernGameCard from '@/components/shop/games/ModernGameCard'
import { Gamepad2, Search, Filter, Star, TrendingUp } from 'lucide-react'

export default async function ShopPage() {
  const supabase = await createSupabaseServer()
  
  // 獲取遊戲數據
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching games:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">載入失敗</h3>
            <p className="text-red-500">無法載入遊戲資料，請稍後再試</p>
          </div>
        </div>
      </div>
    )
  }

  const activeGamesCount = games?.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <Gamepad2 className="w-12 h-12 text-white" />
                </div>
              </div>
              
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                遊戲儲值商店
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                安全便捷的遊戲儲值服務，支援多種熱門遊戲，快速到帳，值得信賴
              </p>
              
              <div className="flex flex-wrap justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">24/7 客服支援</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600">安全保障</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">快速到帳</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md">
                    <Gamepad2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{activeGamesCount}</div>
                    <div className="text-sm text-gray-600">個熱門遊戲</div>
                  </div>
                </div>
                
                <div className="h-8 w-px bg-gray-300"></div>
                
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-green-600">全部上線</span> 
                  <span className="ml-2">隨時可儲值</span>
                </div>
              </div>
              
              <div className="flex gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="搜尋遊戲..."
                    className="w-full pl-10 pr-4 py-2 bg-white/70 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200"
                  />
                </div>
                <button className="px-4 py-2 bg-white/70 border border-gray-200 rounded-xl text-gray-700 hover:bg-white hover:border-gray-300 transition-all duration-200 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">篩選</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {games && games.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game, index) => (
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
                  <Gamepad2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">即將推出</h3>
                <p className="text-gray-600 text-base">
                  我們正在準備更多精彩的遊戲，敬請期待！
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">安全保障</h3>
            </div>
            <p className="text-gray-600">採用銀行級加密技術，保護您的交易安全</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">快速到帳</h3>
            </div>
            <p className="text-gray-600">自動化處理系統，通常在5分鐘內完成儲值</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">優質服務</h3>
            </div>
            <p className="text-gray-600">24小時客服支援，隨時為您解決問題</p>
          </div>
        </div>
      </div>
    </div>
  )
}