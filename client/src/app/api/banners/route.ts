import { createSupabaseServer } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: banners, error } = await supabase
    .from('banner')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(banners)
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServer()
  const banner = await request.json()

  // 取得目前最大的 display_order
  const { data: maxOrderData } = await supabase
    .from('banner')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder = maxOrderData && maxOrderData.length > 0 
    ? (maxOrderData[0].display_order || 0) + 1 
    : 1

  const bannerWithOrder = {
    ...banner,
    display_order: nextOrder
  }

  const { data, error } = await supabase
    .from('banner')
    .insert(bannerWithOrder)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
} 