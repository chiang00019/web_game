import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  const { data: packages, error } = await supabase
    .from('game_packages')
    .select('*')
    .eq('game_id', params.id)
    .eq('is_active', true)
    .order('price', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(packages)
} 