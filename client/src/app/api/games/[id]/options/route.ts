import { createSupabaseServer } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServer()
  const { data: options, error } = await supabase
    .from('game_options')
    .select('*')
    .eq('game_id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(options)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServer()
  const { name, icon_url, price } = await request.json()
  const { data, error } = await supabase
    .from('game_options')
    .insert([{ game_id: params.id, name, icon_url, price }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
