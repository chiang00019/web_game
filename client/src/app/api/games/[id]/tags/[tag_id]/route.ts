import { createSupabaseServer } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; tag_id: string } }
) {
  const supabase = await createSupabaseServer()
  const { error } = await supabase
    .from('game_tags')
    .delete()
    .eq('game_id', params.id)
    .eq('tag_id', params.tag_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new Response(null, { status: 204 })
}
