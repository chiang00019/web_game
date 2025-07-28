import { createSupabaseServer } from '@/utils/supabase/server'

import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string; option_id: string } }
) {
  const supabase = await createSupabaseServer()
  const { name, icon_url, price } = await request.json()
  const { data, error } = await supabase
    .from('game_options')
    .update({ name, icon_url, price })
    .eq('id', params.option_id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; option_id: string } }
) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase
    .from('game_options')
    .delete()
    .eq('id', params.option_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new Response(null, { status: 204 })
}
