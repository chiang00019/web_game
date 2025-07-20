import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import LogoutButton from '@/components/auth/LogoutButton'
import Image from "next/image";
import { StarIcon, SearchIcon, MailIcon, ChevronDownIcon, ShoppingCartIcon } from 'lucide-react';

const GameCard = ({ name, imageUrl, rating, reviews, discount }: { name: string, imageUrl: string, rating: string, reviews: string, discount?: string }) => (
  <div className="bg-[#2a2d4e] rounded-lg overflow-hidden">
    <div className="relative">
      <Image src={imageUrl} alt={name} width={300} height={400} className="w-full h-48 object-cover" />
      {discount && <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md">{discount}</div>}
    </div>
    <div className="p-4">
      <h3 className="text-white font-semibold truncate">{name}</h3>
      <div className="flex items-center text-gray-400 text-sm mt-1">
        <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
        <span>{rating}</span>
        <span className="mx-2">|</span>
        <span>{reviews} reviews</span>
      </div>
    </div>
  </div>
);

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const games = [
    { name: "崩壞:星穹鐵道(全球服)", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "130761", discount: "7折" },
    { name: "原神(全球服)", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "103276", discount: "6.9折" },
    { name: "鳴潮", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "27605", discount: "7.1折" },
    { name: "絕區零(全球服)", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "50957", discount: "6.2折" },
    { name: "Ragnarok M: Classic (國際服)", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "6224", discount: "8.5折" },
    { name: "PUBG Mobile(國際服)", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "15523", discount: "8.4折" },
  ];

  return (
    <div className="bg-[#1a1b2e] min-h-screen text-white">
      <header className="bg-[#4a3d8a] py-3 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold">YH工作室</h1>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-white hover:text-gray-300">主站</a>
            <a href="#" className="flex items-center text-white hover:text-gray-300">遊戲 <ChevronDownIcon className="w-4 h-4 ml-1" /></a>
            <a href="#" className="text-white hover:text-gray-300">部落格</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="請輸入游戲或商品關鍵詞搜尋" className="bg-[#2a2d4e] border border-gray-600 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <button className="hidden md:flex items-center">TWD | 繁體中文 <ChevronDownIcon className="w-4 h-4 ml-1" /></button>
          <button><MailIcon className="w-6 h-6" /></button>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                Hey, {user.email}!
                <LogoutButton />
              </div>
            ) : (
              <Link
                href="/auth"
                className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="bg-[#2a2d4e] py-2 px-6 text-center text-sm">
        <p><span className="bg-purple-600 p-1 rounded-md mr-2">$</span>立即註冊即享85折新人禮! <a href="#" className="underline">前往註冊 {'>'}</a></p>
      </div>

      <main className="px-6 py-8">
        <section className="mb-12">
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <Image src="/placeholder.svg" alt="Promotional Banner" width={1200} height={400} className="w-full h-64 object-cover opacity-50" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <h2 className="text-4xl font-bold">瑪薇卡 & 艾梅莉埃</h2>
              <p className="mt-2 text-lg">太陽真好,希望一切如常</p>
              <button className="mt-4 bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg">立即下單 ▸▸▸</button>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">熱門遊戲</h2>
            <a href="#" className="text-gray-400 hover:text-white">類別</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {games.map(game => <GameCard key={game.name} {...game} />)}
          </div>
        </section>
      </main>
      
      <div className="fixed bottom-8 right-8 bg-blue-500 p-3 rounded-full">
        <ShoppingCartIcon className="w-8 h-8" />
      </div>
    </div>
  );
}
