import { createSupabaseServer } from '@/utils/supabase/server'

import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: games, error } = await supabase.from('games').select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(games)
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServer()
  const { name, icon_url } = await request.json()
  const { data, error } = await supabase
    .from('games')
    .insert([{ name, icon_url }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}