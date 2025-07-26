export default function GameDetails({ game }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={game.icon_url} alt={game.name} className="w-full rounded-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
          <div className="mb-4">
            {game.tags.map((tag) => (
              <span key={tag.id} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                {tag.name}
              </span>
            ))}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Recharge Options</h2>
            <div className="grid grid-cols-2 gap-4">
              {game.game_options.map((option) => (
                <div key={option.id} className="border rounded-lg p-4">
                  <img src={option.icon_url} alt={option.name} className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-center">{option.name}</h3>
                  <p className="text-center font-bold">${option.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
