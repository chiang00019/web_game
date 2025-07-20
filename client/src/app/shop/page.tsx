import { createClient } from "@/utils/supabase/server";
import GameCard from "@/components/shop/GameCard";

export default async function ShopPage() {
  const supabase = await createClient();
  const { data: games, error } = await supabase
    .from("game")
    .select("*")
    .eq("is_active", true)
    .order("game_name");

  if (error) {
    console.error("Error fetching games:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">遊戲商店</h1>
        <p className="text-lg text-gray-300">選擇您要儲值的遊戲</p>
      </div>
      
      {games && games.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <GameCard key={game.game_id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">目前沒有可用的遊戲</p>
        </div>
      )}
    </div>
  );
}
