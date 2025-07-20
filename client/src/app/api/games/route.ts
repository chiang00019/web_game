import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: games, error } = await supabase.from('game').select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(games)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const game = await request.json()

  const { data, error } = await supabase.from('game').insert(game).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
