import GameForm from '@/components/admin/games/GameForm'

interface Tag {
  id: number
  name: string
  display_name: string
}

async function getTags(): Promise<Tag[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tags`, {
      cache: 'no-store'
    })
    if (!response.ok) {
      throw new Error('Failed to fetch tags')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}

export default async function NewGamePage() {
  const allTags = await getTags()

  return (
    <div>
      <GameForm availableTags={allTags} />
    </div>
  )
}
