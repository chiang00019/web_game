import { createSupabaseServer } from '@/utils/supabase/server'

import { NextResponse } from 'next/server'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServer()
  const { tag_id } = await request.json()
  const { data, error } = await supabase
    .from('game_tags')
    .insert([{ game_id: params.id, tag_id }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
