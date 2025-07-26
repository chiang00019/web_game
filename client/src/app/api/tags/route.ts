import { createSupabaseServer } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: tags, error } = await supabase.from('tags').select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(tags)
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServer()
  const { name } = await request.json()
  const { data, error } = await supabase
    .from('tags')
    .insert([{ name }])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
