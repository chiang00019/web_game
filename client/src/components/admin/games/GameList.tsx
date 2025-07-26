import Link from 'next/link'

export default function GameList({ games }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link href="/admin/games/new">
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Game
          </a>
        </Link>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td className="py-2 px-4 border-b">{game.name}</td>
              <td className="py-2 px-4 border-b">
                <Link href={`/admin/games/${game.id}/edit`}>
                  <a className="text-blue-500 hover:underline mr-4">Edit</a>
                </Link>
                <button
                  className="text-red-500 hover:underline"
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this game?')) {
                      const res = await fetch(`/api/games/${game.id}`, {
                        method: 'DELETE',
                      })
                      if (res.ok) {
                        window.location.reload()
                      }
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
