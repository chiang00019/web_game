import Link from 'next/link';

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* UID免帳密儲值區塊 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-orange-500">UID免帳密儲值</h2>
            <Link href="#" className="text-gray-600 hover:text-black flex items-center gap-1">
              右滑查看更多 →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 遊戲卡片 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-xs">遊戲圖標</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-4">第五人格</h3>
              <button className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-2 rounded-full font-medium transition-colors">
                儲值
              </button>
            </div>

            {/* 遊戲卡片 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-xs">遊戲圖標</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-4">原神</h3>
              <button className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-2 rounded-full font-medium transition-colors">
                儲值
              </button>
            </div>

            {/* 遊戲卡片 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-xs">遊戲圖標</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-4">崩壞鐵道</h3>
              <button className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-2 rounded-full font-medium transition-colors">
                儲值
              </button>
            </div>
          </div>
        </section>

        {/* 手機遊戲區塊 */}
        <section>
          <h2 className="text-2xl font-bold text-orange-500 mb-6">手機遊戲</h2>
          
          <div className="space-y-4">
            {/* 遊戲項目 1 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">圖標</span>
                </div>
                <span className="font-semibold text-gray-800">傳說對決</span>
              </div>
              <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-medium transition-colors">
                儲值
              </button>
            </div>

            {/* 遊戲項目 2 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">圖標</span>
                </div>
                <span className="font-semibold text-gray-800">三角洲行動</span>
              </div>
              <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-medium transition-colors">
                儲值
              </button>
            </div>

            {/* 遊戲項目 3 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">圖標</span>
                </div>
                <span className="font-semibold text-gray-800">PUBG Mobile</span>
              </div>
              <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-medium transition-colors">
                儲值
              </button>
            </div>

            {/* 遊戲項目 4 */}
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">圖標</span>
                </div>
                <span className="font-semibold text-gray-800">Mobile Legends</span>
              </div>
              <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-medium transition-colors">
                儲值
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
