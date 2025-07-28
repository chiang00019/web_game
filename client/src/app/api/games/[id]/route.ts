import { createSupabaseServer } from '@/utils/supabase/server'

import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServer()
  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(game)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServer()
  const { name, icon_url } = await request.json()
  const { data, error } = await supabase
    .from('games')
    .update({ name, icon_url })
    .eq('id', params.id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase.from('games').delete().eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new Response(null, { status: 204 })
}