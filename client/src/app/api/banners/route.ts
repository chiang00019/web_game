import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: banners, error } = await supabase
    .from('banner')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(banners)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const banner = await request.json()

  const { data, error } = await supabase
    .from('banner')
    .insert(banner)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
} 