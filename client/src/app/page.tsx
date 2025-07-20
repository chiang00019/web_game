'use client'

import Image from "next/image";
import { StarIcon, ShoppingCartIcon } from 'lucide-react';

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

export default function Home() {
  const games = [
    { name: "崩壞:星穹鐵道(全球服)", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "130761", discount: "7折" },
    { name: "原神(全球服)", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "103276", discount: "6.9折" },
    { name: "鳴潮", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "27605", discount: "7.1折" },
    { name: "絕區零(全球服)", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "50957", discount: "6.2折" },
    { name: "Ragnarok M: Classic (國際服)", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "6224", discount: "8.5折" },
    { name: "PUBG Mobile(國際服)", imageUrl: "/placeholder.svg", rating: "5.0", reviews: "15523", discount: "8.4折" },
  ];

  return (
    <div className="px-6 py-8">
      <section className="mb-12">
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <Image src="/placeholder.svg" alt="Promotional Banner" width={1200} height={400} className="w-full h-64 object-cover opacity-50" />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
            <h2 className="text-4xl font-bold">瑪薇卡 & 艾梅莉埃</h2>
            <p className="mt-2 text-lg">太陽真好,希望一切如常</p>
            <button className="mt-4 bg-yellow-400 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
              立即下單 ▸▸▸
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">熱門遊戲</h2>
          <a href="/shop" className="text-gray-400 hover:text-white">查看全部</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {games.map(game => <GameCard key={game.name} {...game} />)}
        </div>
      </section>
      
      <div className="fixed bottom-8 right-8 bg-blue-500 p-3 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
        <ShoppingCartIcon className="w-8 h-8" />
      </div>
    </div>
  );
}
