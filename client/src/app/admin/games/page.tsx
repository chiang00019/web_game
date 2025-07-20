'use client'

import { useState, useEffect } from 'react'
import GameForm from '@/components/admin/GameForm'

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([])
  const [selectedGame, setSelectedGame] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    const response = await fetch('/api/games')
    const data = await response.json()
    setGames(data)
  }

  const handleSave = async (game: any) => {
    if (selectedGame) {
      // @ts-ignore
      const response = await fetch(`/api/games/${selectedGame.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game),
      })
    } else {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game),
      })
    }
    fetchGames()
    setIsFormOpen(false)
    setSelectedGame(null)
  }

  const handleEdit = (game: any) => {
    setSelectedGame(game)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/games/${id}`, {
      method: 'DELETE',
    })
    fetchGames()
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Games</h1>
        <button
          onClick={() => {
            setSelectedGame(null)
            setIsFormOpen(true)
          }}
          className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Add Game
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-6">
          <GameForm game={selectedGame} onSave={handleSave} />
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {games.map((game) => (
              <tr key={game.id}>
                <td className="px-6 py-4 whitespace-nowrap">{game.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{game.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{game.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(game)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => handleDelete(game.id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
