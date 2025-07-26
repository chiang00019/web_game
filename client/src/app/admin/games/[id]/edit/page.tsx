import { createSupabaseServer } from '@/utils/supabase/server'
import GameForm from '@/components/admin/games/GameForm'

type EditGamePageProps = {
  params: {
    id: string
  }
}

export default async function EditGamePage({ params }: EditGamePageProps) {
  const supabase = await createSupabaseServer()
  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    console.error('Error fetching game:', error)
    return <div>Error fetching game</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Game</h1>
      <GameForm game={game} />
    </div>
  )
}
