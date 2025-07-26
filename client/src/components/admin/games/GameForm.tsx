'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GameForm({ game }) {
  const router = useRouter()
  const [name, setName] = useState(game ? game.name : '')
  const [iconUrl, setIconUrl] = useState(game ? game.icon_url : '')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = game ? 'PUT' : 'POST'
    const url = game ? `/api/games/${game.id}` : '/api/games'
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, icon_url: iconUrl }),
    })
    if (res.ok) {
      router.push('/admin/games')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="iconUrl" className="block text-sm font-medium text-gray-700">
          Icon URL
        </label>
        <input
          type="text"
          id="iconUrl"
          value={iconUrl}
          onChange={(e) => setIconUrl(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {game ? 'Update' : 'Create'}
      </button>
    </form>
  )
}
