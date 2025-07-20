import Image from "next/image";
import Link from "next/link";

interface GameCardProps {
  game: {
    game_id: number;
    game_name: string;
    category?: string;
    icon?: string;
    is_active: boolean;
  };
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/shop/${game.game_id}`}>
      <div className="overflow-hidden bg-[#2a2d4e] rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:bg-[#323659] transition-all duration-200">
        <div className="relative h-48 w-full">
          {game.icon ? (
            <Image
              src={game.icon}
              alt={game.game_name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {game.game_name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-white">{game.game_name}</h3>
          {game.category && (
            <p className="mt-1 text-sm text-purple-400 font-medium">{game.category}</p>
          )}
          <p className="mt-2 text-gray-300 text-sm">點擊進入儲值頁面</p>
        </div>
      </div>
    </Link>
  );
}
